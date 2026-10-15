import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateLabProfile } from '../services/lab-profiles.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { LabProfile, UpdateLabProfilePayload } from '../types'

export function useUpdateLabProfile(
  id: number | undefined,
  options?: { onSuccess?: (profile: LabProfile) => void },
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateLabProfilePayload) => updateLabProfile(id as number, payload),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.labProfiles })
      toast.success('Perfil de laboratorio actualizado correctamente')
      options?.onSuccess?.(profile)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el perfil de laboratorio'))
    },
  })
}
