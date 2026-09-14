import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createIntake } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Intake } from '../types'

interface UseCreateIntakeOptions {
  onSuccess?: (intake: Intake) => void
}

export function useCreateIntake(options?: UseCreateIntakeOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIntake,
    onSuccess: (intake) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.lists() })
      toast.success(`Ingresable "${intake.name}" creado correctamente`)
      options?.onSuccess?.(intake)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el ingresable'))
    },
  })
}
