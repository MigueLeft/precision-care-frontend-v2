import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleCivilStatusActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleCivilStatusActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleCivilStatusActive,
    onSuccess: (civilStatus) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.civilStatuses })
      toast.success(
        civilStatus.active
          ? `${civilStatus.name} marcado como activo`
          : `${civilStatus.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado civil'))
    },
  })
}
