import { useState } from 'react'
import { useDraftConsultationId } from './draft-consultation'
import {
  readDraftField,
  removeDraftField,
  writeDraftField,
} from '@/utils/consultation-draft-storage'

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

type SetState<T> = (next: T | ((prev: T) => T)) => void

// useState con respaldo local dentro de una consulta en curso: cada cambio se
// guarda en localStorage bajo `field` y al montar se recupera lo pendiente.
// Volver al valor inicial (p. ej. al limpiar un formulario tras guardar) borra
// el respaldo. Fuera de una consulta (o sin `field`) es un useState normal.
export function useConsultationDraftState<T>(
  field: string | null,
  initial: T | (() => T),
): [T, SetState<T>, () => void] {
  const consultationId = useDraftConsultationId()
  const persist = consultationId != null && field != null
  const [initialValue] = useState(initial)
  const [value, setValue] = useState<T>(() => {
    if (!persist) return initialValue
    return readDraftField<T>(consultationId, field) ?? initialValue
  })

  const set: SetState<T> = (next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      if (persist) {
        if (sameValue(resolved, initialValue)) removeDraftField(consultationId, field)
        else writeDraftField(consultationId, field, resolved)
      }
      return resolved
    })
  }

  // Descarta el respaldo (lo capturado ya quedó guardado en la consulta).
  const clear = () => {
    if (persist) removeDraftField(consultationId, field)
  }

  return [value, set, clear]
}
