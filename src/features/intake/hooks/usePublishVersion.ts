import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { publishVersion } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { IntakeVersion } from '../types'

interface UsePublishVersionOptions {
  onSuccess?: (version: IntakeVersion) => void
}

export function usePublishVersion(intakeId: number, options?: UsePublishVersionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionId: number) => publishVersion(versionId),
    onSuccess: (version) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      queryClient.invalidateQueries({ queryKey: intakeKeys.lists() })
      toast.success(`Versión ${version.versionNumber} publicada correctamente`)
      options?.onSuccess?.(version)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al publicar la versión'))
    },
  })
}
