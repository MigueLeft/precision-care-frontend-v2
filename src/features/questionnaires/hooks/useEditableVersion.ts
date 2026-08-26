import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getEditableVersion } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { QuestionnaireVersion } from '../types'

interface UseEditableVersionOptions {
  onSuccess?: (version: QuestionnaireVersion) => void
}

export function useEditableVersion(
  questionnaireId: number,
  options?: UseEditableVersionOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getEditableVersion(questionnaireId),
    onSuccess: (version) => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      options?.onSuccess?.(version)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al preparar la versión editable'))
    },
  })
}
