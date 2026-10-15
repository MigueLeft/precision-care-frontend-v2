import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createLabProfile } from '../services/lab-profiles.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { LabProfile } from '../types'

export function useCreateLabProfile(options?: { onSuccess?: (profile: LabProfile) => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLabProfile,
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.labProfiles })
      toast.success(`Perfil ${profile.name} creado correctamente`)
      options?.onSuccess?.(profile)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el perfil de laboratorio'))
    },
  })
}
