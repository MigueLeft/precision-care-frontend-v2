import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleStateActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleStateActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleStateActive,
    onSuccess: (state) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.states })
      toast.success(
        state.active
          ? `${state.name} marcado como activo`
          : `${state.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado'))
    },
  })
}
