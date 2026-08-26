import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateQuestionnaire } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Questionnaire, UpdateQuestionnairePayload } from '../types'

interface UseUpdateQuestionnaireOptions {
  onSuccess?: (questionnaire: Questionnaire) => void
}

export function useUpdateQuestionnaire(
  id: number | undefined,
  options?: UseUpdateQuestionnaireOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateQuestionnairePayload) => updateQuestionnaire(id as number, payload),
    onSuccess: (questionnaire) => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.lists() })
      if (id) queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(id) })
      toast.success('Ingresable actualizado correctamente')
      options?.onSuccess?.(questionnaire)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el ingresable'))
    },
  })
}
