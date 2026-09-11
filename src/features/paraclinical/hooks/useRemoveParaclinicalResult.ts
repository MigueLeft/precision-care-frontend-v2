import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removeParaclinicalResult } from '../services/paraclinical.service'
import { paraclinicalKeys } from './paraclinical.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useRemoveParaclinicalResult(patientId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeParaclinicalResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paraclinicalKeys.resultsByPatient(patientId),
      })
      toast.success('Resultado eliminado')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el resultado'))
    },
  })
}
