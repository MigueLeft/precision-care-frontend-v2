import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createQuestion } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateQuestionPayload } from '../types'

interface UseCreateQuestionOptions {
  onSuccess?: () => void
}

export function useCreateQuestion(questionnaireId: number, options?: UseCreateQuestionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: number; payload: CreateQuestionPayload }) =>
      createQuestion(versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Pregunta agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la pregunta'))
    },
  })
}
