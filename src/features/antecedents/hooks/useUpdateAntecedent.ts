import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAntecedent } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
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

  return useMutation({
    mutationFn: (payload: UpdateAntecedentPayload) =>
      updateAntecedent(antecedentId as number, payload),
    onSuccess: (antecedent) => {
      queryClient.invalidateQueries({
        queryKey: antecedentsKeys.byPatient(patientId),
      })
      toast.success('Antecedente actualizado correctamente')
      options?.onSuccess?.(antecedent)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el antecedente'))
    },
  })
}
