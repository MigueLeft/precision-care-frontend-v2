import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleCityActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleCityActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleCityActive,
    onSuccess: (city) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.cities })
      toast.success(
        city.active
          ? `${city.name} marcada como activa`
          : `${city.name} marcada como inactiva`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la ciudad'))
    },
  })
}
