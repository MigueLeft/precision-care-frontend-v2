import { useState } from 'react'
import { useDraftConsultationId } from './draft-consultation'
import { readCaptureDraft, removeCaptureDraft, writeCaptureDraft } from '@/utils/capture-draft-storage'

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

type SetState<T> = (next: T | ((prev: T) => T)) => void

// useState con respaldo en localStorage para el panel de captura de la
// consulta: lo escrito sobrevive al cambiar de sección o recargar. Volver al
// valor inicial (p. ej. tras agregar) borra el respaldo. Fuera de una consulta
// es un useState normal.
export function useCaptureDraftState<T>(field: string, initial: T | (() => T)): [T, SetState<T>, () => void] {
  const consultationId = useDraftConsultationId()
  const [initialValue] = useState(initial)
  const [value, setValue] = useState<T>(() =>
    consultationId == null ? initialValue : (readCaptureDraft<T>(consultationId, field) ?? initialValue),
  )

  const set: SetState<T> = (next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      if (consultationId != null) {
        if (sameValue(resolved, initialValue)) removeCaptureDraft(consultationId, field)
        else writeCaptureDraft(consultationId, field, resolved)
      }
      return resolved
    })
  }

  // Descarta el respaldo (lo capturado ya quedó guardado).
  const clear = () => {
    if (consultationId != null) removeCaptureDraft(consultationId, field)
  }

  return [value, set, clear]
}
