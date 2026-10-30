import { api } from './api'

// Respaldo de lo que se escribe en una consulta en curso (textos, formularios a
// medio llenar, examen físico…): si se sale de la página, se cierra el navegador
// o vence la sesión, al volver se recupera. Se guarda en el backend
// (consultation.draft_state) como { fields: { [clave]: valor } }: se mantiene en
// memoria, se envía completo poco después de cada cambio y el backend lo borra
// al finalizar la consulta.

const SAVE_DELAY_MS = 800

const drafts = new Map<number, Record<string, unknown>>()
// Consultas con cambios aún sin confirmar por el servidor.
const dirty = new Set<number>()
const timers = new Map<number, ReturnType<typeof setTimeout>>()

const draftUrl = (consultationId: number) => `/consultations/${consultationId}/draft-state`

async function save(consultationId: number) {
  timers.delete(consultationId)
  const fields = drafts.get(consultationId)
  if (!fields) return
  try {
    await api.put(draftUrl(consultationId), { fields })
    // Si hubo cambios mientras se enviaba, ya hay otro envío agendado.
    if (!timers.has(consultationId)) dirty.delete(consultationId)
  } catch {
    // Sin conexión o sesión vencida: queda pendiente y se reintenta con el
    // siguiente cambio, al volver a abrir la consulta o al finalizarla.
  }
}

function scheduleSave(consultationId: number) {
  dirty.add(consultationId)
  clearTimeout(timers.get(consultationId))
  timers.set(consultationId, setTimeout(() => void save(consultationId), SAVE_DELAY_MS))
}

// Carga el respaldo guardado en el servidor. Si en esta pestaña ya hay uno con
// cambios sin enviar, manda ese (es el más reciente).
export async function loadConsultationDraft(consultationId: number) {
  if (drafts.has(consultationId)) {
    if (dirty.has(consultationId)) scheduleSave(consultationId)
    return
  }
  const { data } = await api.get<{ draftState: { fields: Record<string, unknown> } }>(
    draftUrl(consultationId),
  )
  if (!drafts.has(consultationId)) drafts.set(consultationId, { ...data.draftState.fields })
}

export function readDraftField<T>(consultationId: number, field: string): T | undefined {
  return drafts.get(consultationId)?.[field] as T | undefined
}

export function writeDraftField(consultationId: number, field: string, value: unknown) {
  const fields = drafts.get(consultationId) ?? {}
  fields[field] = value
  drafts.set(consultationId, fields)
  scheduleSave(consultationId)
}

export function removeDraftField(consultationId: number, field: string) {
  const fields = drafts.get(consultationId)
  if (!fields || !(field in fields)) return
  delete fields[field]
  scheduleSave(consultationId)
}

// Envía ya lo pendiente (antes de finalizar). false si no se pudo.
export async function flushConsultationDraft(consultationId: number) {
  if (!dirty.has(consultationId)) return true
  clearTimeout(timers.get(consultationId))
  await save(consultationId)
  return !dirty.has(consultationId)
}

// Al salir de la página se intenta enviar lo pendiente (keepalive).
export function flushDraftsOnPageHide() {
  for (const consultationId of dirty) {
    const fields = drafts.get(consultationId)
    if (!fields) continue
    try {
      void fetch(`${api.defaults.baseURL}${draftUrl(consultationId)}`, {
        method: 'PUT',
        credentials: 'include',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      })
    } catch {
      // keepalive limita el tamaño: si no cabe, queda el último guardado.
    }
  }
}

// Al finalizar la consulta todo ya está en la base (el backend borra el respaldo).
export function clearConsultationDraft(consultationId: number) {
  clearTimeout(timers.get(consultationId))
  timers.delete(consultationId)
  dirty.delete(consultationId)
  drafts.delete(consultationId)
}

// ─────────────────────────────────────────────────────────────────────────────
// Versión anterior con localStorage (desactivada: el respaldo ahora vive en el
// backend). Se conserva como referencia.
// ─────────────────────────────────────────────────────────────────────────────
//
// import { clearOutbox } from './consultation-outbox'
//
// const PREFIX = 'precision-care:consultation-draft:'
// const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
//
// interface StoredDraft {
//   updatedAt: number
//   fields: Record<string, unknown>
// }
//
// const storageKey = (consultationId: number) => `${PREFIX}${consultationId}`
//
// function read(consultationId: number): StoredDraft | null {
//   try {
//     const raw = localStorage.getItem(storageKey(consultationId))
//     if (!raw) return null
//     const parsed = JSON.parse(raw) as StoredDraft
//     return parsed && typeof parsed.fields === 'object' ? parsed : null
//   } catch {
//     return null
//   }
// }
//
// function write(consultationId: number, draft: StoredDraft) {
//   try {
//     if (Object.keys(draft.fields).length === 0) localStorage.removeItem(storageKey(consultationId))
//     else localStorage.setItem(storageKey(consultationId), JSON.stringify(draft))
//   } catch {
//     // Sin almacenamiento disponible (modo privado, cuota llena): se sigue sin respaldo.
//   }
// }
//
// export function readDraftField<T>(consultationId: number, field: string): T | undefined {
//   return read(consultationId)?.fields[field] as T | undefined
// }
//
// export function writeDraftField(consultationId: number, field: string, value: unknown) {
//   const draft = read(consultationId) ?? { updatedAt: Date.now(), fields: {} }
//   draft.fields[field] = value
//   draft.updatedAt = Date.now()
//   write(consultationId, draft)
// }
//
// export function removeDraftField(consultationId: number, field: string) {
//   const draft = read(consultationId)
//   if (!draft || !(field in draft.fields)) return
//   delete draft.fields[field]
//   draft.updatedAt = Date.now()
//   write(consultationId, draft)
// }
//
// export function clearConsultationDraft(consultationId: number) {
//   clearOutbox(consultationId)
//   try {
//     localStorage.removeItem(storageKey(consultationId))
//   } catch {
//     // Ignorado: ver write().
//   }
// }
//
// export function purgeStaleConsultationDrafts() {
//   try {
//     const now = Date.now()
//     for (let i = localStorage.length - 1; i >= 0; i--) {
//       const key = localStorage.key(i)
//       if (!key?.startsWith(PREFIX)) continue
//       const id = Number(key.slice(PREFIX.length))
//       const draft = read(id)
//       if (!draft || now - draft.updatedAt > MAX_AGE_MS) localStorage.removeItem(key)
//     }
//   } catch {
//     // Ignorado: ver write().
//   }
// }
