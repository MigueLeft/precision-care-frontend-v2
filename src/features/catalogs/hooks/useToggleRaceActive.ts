import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleRaceActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleRaceActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleRaceActive,
    onSuccess: (race) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.races })
      toast.success(race.active ? `${race.name} marcada como activa` : `${race.name} marcada como inactiva`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado de la raza'))
    },
  })
}
