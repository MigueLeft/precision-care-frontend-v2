import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removeParaclinicalValue } from '../services/paraclinical.service'
import { paraclinicalKeys } from './paraclinical.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useRemoveParaclinicalValue(patientId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ resultId, valueId }: { resultId: number; valueId: number }) =>
      removeParaclinicalValue(resultId, valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paraclinicalKeys.resultsByPatient(patientId),
      })
      toast.success('Estudio eliminado')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el estudio'))
    },
  })
}
