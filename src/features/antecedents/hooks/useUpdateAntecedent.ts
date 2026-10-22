import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { updateAntecedent } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
import { useDraftConsultationId } from '@/hooks/draft-consultation'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Antecedent, UpdateAntecedentPayload } from '../types'

interface Options {
  onSuccess?: (antecedent: Antecedent) => void
}

export function useUpdateAntecedent(
  patientId: number,
  antecedentId: number | undefined,
  options?: Options,
) {
  const queryClient = useQueryClient()
  // Dentro de una consulta en curso el cambio queda como borrador.
  const consultationId = useDraftConsultationId()

  return useMutation({
    mutationFn: (payload: UpdateAntecedentPayload) =>
      updateAntecedent(antecedentId as number, { ...payload, consultationId }),
    onSuccess: (antecedent) => {
      queryClient.invalidateQueries({
        queryKey: antecedentsKeys.ofPatient(patientId),
      })
      toast.success('Antecedente actualizado correctamente')
      options?.onSuccess?.(antecedent)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el antecedente'))
    },
  })
}
