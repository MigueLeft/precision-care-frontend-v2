import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleBodySystemActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleBodySystemActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleBodySystemActive,
    onSuccess: (bodySystem) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.bodySystems })
      toast.success(
        bodySystem.active ? `${bodySystem.name} marcado como activo` : `${bodySystem.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el aparato/sistema'))
    },
  })
}
