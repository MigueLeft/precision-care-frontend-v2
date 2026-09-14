import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createRangeInterpretation } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateRangeInterpretationPayload } from '../types'

interface UseCreateRangeInterpretationOptions {
  onSuccess?: () => void
}

export function useCreateRangeInterpretation(
  intakeId: number,
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
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Interpretación agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la interpretación'))
    },
  })
}
