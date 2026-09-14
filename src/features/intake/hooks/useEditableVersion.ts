import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getEditableVersion } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { IntakeVersion } from '../types'

interface UseEditableVersionOptions {
  onSuccess?: (version: IntakeVersion) => void
}

export function useEditableVersion(
  intakeId: number,
  options?: UseEditableVersionOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getEditableVersion(intakeId),
    onSuccess: (version) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      options?.onSuccess?.(version)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al preparar la versión editable'))
    },
  })
}
