import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDraftConsultationId } from '@/hooks/draft-consultation'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { toast } from '@/utils/toast'
import { createAntecedent } from '../services/antecedents.service'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { mapFormToPayload } from '../utils/antecedent-mappers'
import { antecedentsKeys } from './antecedents.keys'

// Conserva únicamente los registros fallidos para que un reintento no duplique los guardados.
export function useCreateAntecedents(patientId: number) {
  const queryClient = useQueryClient()
  const consultationId = useDraftConsultationId()
  return useMutation({
    mutationFn: async (values: AntecedentFormValues[]) => {
      const failed: AntecedentFormValues[] = []
      let firstError: unknown
      // El backend resuelve catálogos al crear; el envío secuencial evita altas simultáneas.
      for (const value of values) {
        try {
          await createAntecedent({ ...mapFormToPayload(value), patientId, consultationId })
        } catch (error) {
          failed.push(value)
          firstError ??= error
        }
      }
      return { failed, created: values.length - failed.length, firstError }
    },
    onSuccess: ({ failed, created, firstError }) => {
      queryClient.invalidateQueries({ queryKey: antecedentsKeys.ofPatient(patientId) })
      if (created) toast.success(`${created} antecedente${created === 1 ? '' : 's'} agregado${created === 1 ? '' : 's'} correctamente`)
      if (failed.length) toast.error(getApiErrorMessage(firstError, `No se pudieron guardar ${failed.length} antecedentes. Puedes corregirlos y reintentar.`))
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Error al agregar los antecedentes')),
  })
}
