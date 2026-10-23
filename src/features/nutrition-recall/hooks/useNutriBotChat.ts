import { useEffect, useRef, useState } from 'react'
import { FRIENDLY_ERROR_MESSAGE, reportError } from '@/utils/report-error'
import { finishNutritionRecall, streamNutriBotTurn } from '../services/public-nutrition-recall.service'
import type { ChatTurn, NutritionRecallReportStatus } from '../types'
import { loadSavedConversation, saveConversation } from '../utils/conversation-storage'

// Marcador con el que NutriBot indica que la entrevista terminó.
const GENERATE_REPORT_MARKER = '[GENERATE_REPORT]'
// Mayor que los límites del servidor, para que normalmente sea él quien cierre.
const CLIENT_IDLE_TIMEOUT_MS = 60_000

export interface ChatBubble {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
  isError?: boolean
}

export type ReportPhase =
  | { kind: 'interview' }
  | { kind: 'generating' }
  | { kind: 'done'; status: NutritionRecallReportStatus }
  | { kind: 'error'; detail: string }

let idCounter = 0
const nextId = () => `${Date.now()}_${++idCounter}`

const toBubbles = (turns: ChatTurn[]): ChatBubble[] =>
  turns.map((turn) => ({ id: nextId(), role: turn.role, content: turn.content }))

// Conduce la entrevista con NutriBot: cada turno se transmite por SSE y, al
// recibir el marcador de cierre, se pide al backend el reporte final.
export function useNutriBotChat(token: string) {
  const [saved] = useState(() => loadSavedConversation(token))
  const history = useRef<ChatTurn[]>(saved)
  const [bubbles, setBubbles] = useState<ChatBubble[]>(() => toBubbles(saved))
  const [isLoading, setIsLoading] = useState(false)
  const [phase, setPhase] = useState<ReportPhase>({ kind: 'interview' })
  const started = useRef(false)

  const updateBubble = (id: string, patch: Partial<ChatBubble>) =>
    setBubbles((prev) => prev.map((bubble) => (bubble.id === id ? { ...bubble, ...patch } : bubble)))

  async function finish() {
    setPhase({ kind: 'generating' })
    try {
      const status = await finishNutritionRecall(token, history.current, new AbortController().signal)
      setPhase({ kind: 'done', status })
    } catch (error) {
      reportError(error, 'nutribot', { step: 'finish' })
      setPhase({ kind: 'error', detail: FRIENDLY_ERROR_MESSAGE })
    }
  }

  async function runTurn() {
    const id = nextId()
    setBubbles((prev) => [...prev, { id, role: 'assistant', content: '', streaming: true }])
    setIsLoading(true)
    const abort = new AbortController()
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    const armIdleTimer = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => abort.abort(), CLIENT_IDLE_TIMEOUT_MS)
    }
    armIdleTimer()

    let fullText = ''
    try {
      await streamNutriBotTurn(
        token,
        history.current,
        (text) => {
          fullText += text
          updateBubble(id, { content: fullText.replace(GENERATE_REPORT_MARKER, '').trim() })
        },
        { signal: abort.signal, onActivity: armIdleTimer },
      )
    } catch (error) {
      // El paciente solo ve el mensaje predeterminado; el detalle va a Sentry.
      reportError(error, 'nutribot', { step: 'chat', timedOut: abort.signal.aborted, partial: !!fullText })
      // Si ya llegó texto, se conserva la pregunta para que el paciente responda.
      if (!fullText) {
        updateBubble(id, { content: FRIENDLY_ERROR_MESSAGE, streaming: false, isError: true })
        setIsLoading(false)
        return
      }
    } finally {
      clearTimeout(idleTimer)
    }

    const isClosing = fullText.includes(GENERATE_REPORT_MARKER)
    const content = fullText.replace(GENERATE_REPORT_MARKER, '').trim()
    updateBubble(id, { content, streaming: false })
    history.current = [...history.current, { role: 'assistant', content }]
    saveConversation(token, history.current)
    setIsLoading(false)
    if (isClosing) await finish()
  }

  async function send(text: string) {
    const content = text.trim()
    if (!content || isLoading || phase.kind !== 'interview') return
    setBubbles((prev) => [...prev, { id: nextId(), role: 'user', content }])
    history.current = [...history.current, { role: 'user', content }]
    saveConversation(token, history.current)
    await runTurn()
  }

  // Saludo inicial al abrir el enlace (o se retoma la conversación guardada).
  useEffect(() => {
    if (started.current) return
    started.current = true
    // Sin historial, o si el último turno del paciente quedó sin respuesta.
    if (history.current.at(-1)?.role !== 'assistant') void runTurn()
  })

  return { bubbles, isLoading, phase, send, retryFinish: finish }
}
