import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteQuestion } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteQuestionOptions {
  onSuccess?: () => void
}

export function useDeleteQuestion(intakeId: number, options?: UseDeleteQuestionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: number) => deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Pregunta eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la pregunta'))
    },
  })
}
