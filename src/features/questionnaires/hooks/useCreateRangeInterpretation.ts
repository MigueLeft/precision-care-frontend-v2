import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createRangeInterpretation } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateRangeInterpretationPayload } from '../types'

interface UseCreateRangeInterpretationOptions {
  onSuccess?: () => void
}

export function useCreateRangeInterpretation(
  questionnaireId: number,
  options?: UseCreateRangeInterpretationOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      mappingId,
      payload,
    }: {
      mappingId: number
      payload: CreateRangeInterpretationPayload
    }) => createRangeInterpretation(mappingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Interpretación agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la interpretación'))
    },
  })
}
