import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleSocioeconomicLevelActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleSocioeconomicLevelActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleSocioeconomicLevelActive,
    onSuccess: (level) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.socioeconomicLevels })
      toast.success(level.active ? `${level.name} marcado como activo` : `${level.name} marcado como inactivo`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el nivel socioeconómico'))
    },
  })
}
