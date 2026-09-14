import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateIntake } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Intake, UpdateIntakePayload } from '../types'

interface UseUpdateIntakeOptions {
  onSuccess?: (intake: Intake) => void
}

export function useUpdateIntake(
  id: number | undefined,
  options?: UseUpdateIntakeOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateIntakePayload) => updateIntake(id as number, payload),
    onSuccess: (intake) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.lists() })
      if (id) queryClient.invalidateQueries({ queryKey: intakeKeys.detail(id) })
      toast.success('Ingresable actualizado correctamente')
      options?.onSuccess?.(intake)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el ingresable'))
    },
  })
}
