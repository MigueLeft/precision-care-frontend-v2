import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createQuestionnaire } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Questionnaire } from '../types'

interface UseCreateQuestionnaireOptions {
  onSuccess?: (questionnaire: Questionnaire) => void
}

export function useCreateQuestionnaire(options?: UseCreateQuestionnaireOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createQuestionnaire,
    onSuccess: (questionnaire) => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.lists() })
      toast.success(`Ingresable "${questionnaire.name}" creado correctamente`)
      options?.onSuccess?.(questionnaire)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el ingresable'))
    },
  })
}
