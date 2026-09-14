import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateRangeInterpretation } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateRangeInterpretationPayload } from '../types'

interface UseUpdateRangeInterpretationOptions {
  onSuccess?: () => void
}

export function useUpdateRangeInterpretation(
  intakeId: number,
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
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Interpretación actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la interpretación'))
    },
  })
}
