import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteRangeInterpretation } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteRangeInterpretationOptions {
  onSuccess?: () => void
}

export function useDeleteRangeInterpretation(
  questionnaireId: number,
  options?: UseDeleteRangeInterpretationOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (interpretationId: number) => deleteRangeInterpretation(interpretationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Interpretación eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la interpretación'))
    },
  })
}
