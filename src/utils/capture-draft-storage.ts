// Respaldo local (solo en este navegador) de lo que se está capturando en el
// panel de captura de la consulta: al cambiar de sección o recargar la página
// se recupera lo que no se terminó de agregar. Se borra al finalizar la consulta.

const PREFIX = 'precision-care:capture-draft:'

const storageKey = (consultationId: number) => `${PREFIX}${consultationId}`

function readAll(consultationId: number): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(storageKey(consultationId))
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

function writeAll(consultationId: number, fields: Record<string, unknown>) {
  try {
    if (Object.keys(fields).length === 0) localStorage.removeItem(storageKey(consultationId))
    else localStorage.setItem(storageKey(consultationId), JSON.stringify(fields))
  } catch {
    // Sin espacio o almacenamiento bloqueado: se pierde solo el respaldo.
  }
}

export function readCaptureDraft<T>(consultationId: number, field: string): T | undefined {
  return readAll(consultationId)[field] as T | undefined
}

export function writeCaptureDraft(consultationId: number, field: string, value: unknown) {
  writeAll(consultationId, { ...readAll(consultationId), [field]: value })
}

export function removeCaptureDraft(consultationId: number, field: string) {
  const fields = readAll(consultationId)
  if (!(field in fields)) return
  delete fields[field]
  writeAll(consultationId, fields)
}

export function clearCaptureDrafts(consultationId: number) {
  try {
    localStorage.removeItem(storageKey(consultationId))
  } catch {
    // Almacenamiento bloqueado: no hay nada que borrar.
  }
}
