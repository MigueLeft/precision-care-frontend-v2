import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteRangeInterpretation } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteRangeInterpretationOptions {
  onSuccess?: () => void
}

export function useDeleteRangeInterpretation(
  intakeId: number,
  options?: UseDeleteRangeInterpretationOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (interpretationId: number) => deleteRangeInterpretation(interpretationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Interpretación eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la interpretación'))
    },
  })
}
