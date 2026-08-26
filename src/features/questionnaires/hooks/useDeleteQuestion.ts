import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteQuestion } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteQuestionOptions {
  onSuccess?: () => void
}

export function useDeleteQuestion(questionnaireId: number, options?: UseDeleteQuestionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: number) => deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Pregunta eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la pregunta'))
    },
  })
}
