import { useEffect } from 'react'
import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { useDraftConsultationId } from './draft-consultation'
import {
  readDraftField,
  removeDraftField,
  writeDraftField,
} from '@/utils/consultation-draft-storage'

// Respaldo de un formulario de react-hook-form dentro de la consulta en curso:
// al montar recupera lo que quedó escrito (como cambios del usuario) y guarda
// cada cambio. Devuelve `clear` para descartarlo al enviar el formulario.
export function useConsultationDraftForm<T extends FieldValues>(
  field: string | null,
  form: UseFormReturn<T>,
) {
  const consultationId = useDraftConsultationId()
  const persist = consultationId != null && field != null

  useEffect(() => {
    if (!persist) return
    const stored = readDraftField<Partial<T>>(consultationId, field)
    for (const [key, value] of Object.entries(stored ?? {})) {
      const path = key as Path<T>
      if (JSON.stringify(form.getValues(path)) !== JSON.stringify(value)) {
        form.setValue(path, value as PathValue<T, Path<T>>, { shouldDirty: true })
      }
    }
    const subscription = form.watch((values) => writeDraftField(consultationId, field, values))
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist, consultationId, field])

  return () => {
    if (persist) removeDraftField(consultationId, field)
  }
}
