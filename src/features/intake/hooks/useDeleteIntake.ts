import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteIntake } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteIntakeOptions {
  onSuccess?: () => void
}

export function useDeleteIntake(options?: UseDeleteIntakeOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteIntake(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.lists() })
      toast.success('Ingresable eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el ingresable'))
    },
  })
}
