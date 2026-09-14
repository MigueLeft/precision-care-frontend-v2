import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createQuestion } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateQuestionPayload } from '../types'

interface UseCreateQuestionOptions {
  onSuccess?: () => void
}

export function useCreateQuestion(intakeId: number, options?: UseCreateQuestionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: number; payload: CreateQuestionPayload }) =>
      createQuestion(versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Pregunta agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la pregunta'))
    },
  })
}
