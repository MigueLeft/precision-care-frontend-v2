import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteOption } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteOptionOptions {
  onSuccess?: () => void
}

export function useDeleteOption(intakeId: number, options?: UseDeleteOptionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (optionId: number) => deleteOption(optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Opción eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la opción'))
    },
  })
}
