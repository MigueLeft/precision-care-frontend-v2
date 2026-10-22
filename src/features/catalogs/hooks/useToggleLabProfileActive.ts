import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { toggleLabProfileActive } from '../services/lab-profiles.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleLabProfileActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleLabProfileActive,
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.labProfiles })
      toast.success(
        profile.active
          ? `${profile.name} marcado como activo`
          : `${profile.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado del perfil'))
    },
  })
}
