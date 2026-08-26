import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateQuestion } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateQuestionPayload } from '../types'

interface UseUpdateQuestionOptions {
  onSuccess?: () => void
}

export function useUpdateQuestion(questionnaireId: number, options?: UseUpdateQuestionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: number
      payload: UpdateQuestionPayload
    }) => updateQuestion(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Pregunta actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la pregunta'))
    },
  })
}
