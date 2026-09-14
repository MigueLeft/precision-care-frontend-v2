import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateQuestion } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateQuestionPayload } from '../types'

interface UseUpdateQuestionOptions {
  onSuccess?: () => void
}

export function useUpdateQuestion(intakeId: number, options?: UseUpdateQuestionOptions) {
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
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Pregunta actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la pregunta'))
    },
  })
}
