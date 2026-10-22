import { api } from '@/utils/api'
import type { ChatTurn, NutritionRecallReportStatus, PublicNutritionRecall } from '../types'
import { readEventStream } from '../utils/read-event-stream'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function fetchPublicNutritionRecall(token: string): Promise<PublicNutritionRecall> {
  const { data } = await api.get<{ recall: PublicNutritionRecall }>(
    `/public/nutrition-recalls/${token}`,
  )
  return data.recall
}

// Las respuestas de NutriBot llegan por SSE, que axios no transmite; por eso
// estas dos llamadas usan fetch.
async function postStream(token: string, path: 'chat' | 'finish', messages: ChatTurn[], signal: AbortSignal) {
  const response = await fetch(`${API_URL}/public/nutrition-recalls/${token}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { mensaje?: string } | null
    throw new Error(body?.mensaje ?? `Error ${response.status}`)
  }
  return response
}

// Un turno de la entrevista: onText recibe cada fragmento del mensaje.
export async function streamNutriBotTurn(
  token: string,
  messages: ChatTurn[],
  onText: (text: string) => void,
  options: { signal: AbortSignal; onActivity: () => void },
): Promise<void> {
  const response = await postStream(token, 'chat', messages, options.signal)
  await readEventStream(
    response,
    (event) => {
      if (typeof event.error === 'string') throw new Error(event.error)
      if (typeof event.text === 'string') onText(event.text)
    },
    options.onActivity,
  )
}

// Cierra la entrevista: el backend calcula el reporte y envía el PDF.
export async function finishNutritionRecall(
  token: string,
  messages: ChatTurn[],
  signal: AbortSignal,
): Promise<NutritionRecallReportStatus> {
  const response = await postStream(token, 'finish', messages, signal)
  let status: NutritionRecallReportStatus | null = null
  await readEventStream(response, (event) => {
    if (typeof event.error === 'string') throw new Error(event.error)
    if (typeof event.reportStatus === 'string') status = event.reportStatus as NutritionRecallReportStatus
  })
  if (!status) throw new Error('No recibimos la confirmación del envío de tu reporte.')
  return status
}
