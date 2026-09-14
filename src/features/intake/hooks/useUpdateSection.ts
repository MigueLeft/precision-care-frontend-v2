import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSection } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateSectionPayload } from '../types'

interface UseUpdateSectionOptions {
  onSuccess?: () => void
}

export function useUpdateSection(intakeId: number, options?: UseUpdateSectionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: number; payload: UpdateSectionPayload }) =>
      updateSection(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Sección actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la sección'))
    },
  })
}
