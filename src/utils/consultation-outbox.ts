import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// Bandeja de salida de la consulta en curso: todo envío (POST/PATCH/PUT/DELETE)
// ligado a una consulta se guarda en localStorage antes de salir y se borra
// cuando el servidor lo confirma. Si no llegó (sin red, sesión vencida, servidor
// caído) queda pendiente y se reenvía, en orden, al volver a abrir la consulta y
// antes de finalizarla.

const PREFIX = 'precision-care:consultation-outbox:'
const REPLAY_HEADER = 'X-Outbox-Replay'
const WRITE_METHODS = new Set(['post', 'patch', 'put', 'delete'])
// Errores que justifican reintentar más tarde; el resto (validación, conflicto,
// permisos) fallaría igual al reenviarse.
const RETRYABLE_STATUS = new Set([401, 408, 425, 429, 500, 502, 503, 504])

// Envíos aún en curso en esta pestaña: el reenvío no los duplica.
const inFlight = new Set<string>()
// Consultas cuyo reenvío está corriendo (evita reenvíos simultáneos).
const replaying = new Set<number>()

export interface OutboxEntry {
  id: string
  method: string
  url: string
  data?: unknown
  createdAt: number
}

type OutboxConfig = InternalAxiosRequestConfig & {
  outboxEntry?: { consultationId: number; id: string }
}

const storageKey = (consultationId: number) => `${PREFIX}${consultationId}`

export function readOutbox(consultationId: number): OutboxEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(consultationId))
    const parsed = raw ? (JSON.parse(raw) as OutboxEntry[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeOutbox(consultationId: number, entries: OutboxEntry[]) {
  try {
    if (entries.length === 0) localStorage.removeItem(storageKey(consultationId))
    else localStorage.setItem(storageKey(consultationId), JSON.stringify(entries))
  } catch {
    // Sin almacenamiento disponible: el envío sigue sin respaldo.
  }
}

function removeOutboxEntry(consultationId: number, id: string) {
  inFlight.delete(id)
  writeOutbox(
    consultationId,
    readOutbox(consultationId).filter((entry) => entry.id !== id),
  )
}

export function clearOutbox(consultationId: number) {
  writeOutbox(consultationId, [])
}

const parseBody = (data: unknown): unknown => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

// Consulta a la que pertenece un envío: por la URL (/consultations/:id/…) o por
// el `consultationId` del cuerpo (antropometría, laboratorio, antecedentes…).
function consultationOf(url: string, data: unknown): number | null {
  const match = /\/consultations\/(\d+)/.exec(url)
  if (match) return Number(match[1])
  const body = parseBody(data)
  if (body && typeof body === 'object' && 'consultationId' in body) {
    const id = Number((body as { consultationId: unknown }).consultationId)
    return Number.isInteger(id) && id > 0 ? id : null
  }
  return null
}

const isFinalize = (data: unknown) => {
  const body = parseBody(data)
  return !!body && typeof body === 'object' && (body as { status?: unknown }).status === 'completed'
}

const isRetryable = (error: unknown) => {
  const status = (error as AxiosError).response?.status
  return status === undefined || RETRYABLE_STATUS.has(status)
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

function track(config: OutboxConfig): OutboxConfig {
  const method = (config.method ?? 'get').toLowerCase()
  const url = config.url ?? ''
  if (!WRITE_METHODS.has(method) || config.data instanceof FormData) return config
  const consultationId = consultationOf(url, config.data)
  // Finalizar no se reenvía solo: requiere que el médico lo confirme de nuevo.
  if (consultationId == null || isFinalize(config.data)) return config

  // Un reenvío conserva su entrada; un envío nuevo se agrega al final.
  const replayId = config.headers?.[REPLAY_HEADER] as string | undefined
  if (replayId) {
    delete config.headers[REPLAY_HEADER]
    config.outboxEntry = { consultationId, id: replayId }
  } else {
    const entry: OutboxEntry = {
      id: newId(),
      method,
      url,
      data: parseBody(config.data),
      createdAt: Date.now(),
    }
    writeOutbox(consultationId, [...readOutbox(consultationId), entry])
    config.outboxEntry = { consultationId, id: entry.id }
  }
  inFlight.add(config.outboxEntry.id)
  return config
}

export function installConsultationOutbox(api: AxiosInstance) {
  api.interceptors.request.use(track)
  api.interceptors.response.use(
    (response) => {
      const entry = (response.config as OutboxConfig).outboxEntry
      if (entry) removeOutboxEntry(entry.consultationId, entry.id)
      return response
    },
    (error: AxiosError) => {
      const entry = (error.config as OutboxConfig | undefined)?.outboxEntry
      if (entry) {
        inFlight.delete(entry.id)
        // Rechazado por el servidor (no por red/sesión): reenviarlo no sirve.
        if (!isRetryable(error)) removeOutboxEntry(entry.consultationId, entry.id)
      }
      return Promise.reject(error)
    },
  )
}

// Reenvía, en orden, lo pendiente de una consulta. Se detiene en el primer
// envío que vuelve a fallar por red/sesión (queda pendiente para después).
export async function replayOutbox(api: AxiosInstance, consultationId: number) {
  let sent = 0
  if (!replaying.has(consultationId)) {
    replaying.add(consultationId)
    try {
      for (const entry of readOutbox(consultationId)) {
        if (inFlight.has(entry.id)) continue
        try {
          await api.request({
            method: entry.method,
            url: entry.url,
            data: entry.data,
            headers: { [REPLAY_HEADER]: entry.id },
          })
          sent++
        } catch (error) {
          if (isRetryable(error)) break
        }
      }
    } finally {
      replaying.delete(consultationId)
    }
  }
  return { sent, pending: readOutbox(consultationId).length }
}
