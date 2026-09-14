import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSection } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateSectionPayload } from '../types'

interface UseCreateSectionOptions {
  onSuccess?: () => void
}

export function useCreateSection(intakeId: number, options?: UseCreateSectionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: number; payload: CreateSectionPayload }) =>
      createSection(versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Sección agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la sección'))
    },
  })
}
