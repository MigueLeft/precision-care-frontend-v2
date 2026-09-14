import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateOption } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateOptionPayload } from '../types'

interface UseUpdateOptionOptions {
  onSuccess?: () => void
}

export function useUpdateOption(intakeId: number, options?: UseUpdateOptionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ optionId, payload }: { optionId: number; payload: UpdateOptionPayload }) =>
      updateOption(optionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Opción actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la opción'))
    },
  })
}
