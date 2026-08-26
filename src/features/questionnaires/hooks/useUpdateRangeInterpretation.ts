import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateRangeInterpretation } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateRangeInterpretationPayload } from '../types'

interface UseUpdateRangeInterpretationOptions {
  onSuccess?: () => void
}

export function useUpdateRangeInterpretation(
  questionnaireId: number,
  options?: UseUpdateRangeInterpretationOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      interpretationId,
      payload,
    }: {
      interpretationId: number
      payload: UpdateRangeInterpretationPayload
    }) => updateRangeInterpretation(interpretationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Interpretación actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la interpretación'))
    },
  })
}
