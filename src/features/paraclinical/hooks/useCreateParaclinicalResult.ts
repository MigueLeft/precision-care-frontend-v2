import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createParaclinicalResult } from '../services/paraclinical.service'
import { paraclinicalKeys } from './paraclinical.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateParaclinicalResultInput } from '../types'

export function useCreateParaclinicalResult(patientId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateParaclinicalResultInput) =>
      createParaclinicalResult(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paraclinicalKeys.resultsByPatient(patientId),
      })
      toast.success('Resultado registrado')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al registrar el resultado'))
    },
  })
}
