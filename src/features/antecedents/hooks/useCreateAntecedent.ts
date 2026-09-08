import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAntecedent } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Antecedent, CreateAntecedentPayload } from '../types'

interface Options {
  onSuccess?: (antecedent: Antecedent) => void
}

export function useCreateAntecedent(patientId: number, options?: Options) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAntecedentPayload) => createAntecedent(payload),
    onSuccess: (antecedent) => {
      queryClient.invalidateQueries({
        queryKey: antecedentsKeys.byPatient(patientId),
      })
      toast.success('Antecedente agregado correctamente')
      options?.onSuccess?.(antecedent)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar el antecedente'))
    },
  })
}
