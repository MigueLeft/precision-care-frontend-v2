import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleParaclinicalActive } from '../services/paraclinicals.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleParaclinicalActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleParaclinicalActive,
    onSuccess: (paraclinical) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.paraclinicals })
      toast.success(
        paraclinical.active
          ? `${paraclinical.name} marcado como activo`
          : `${paraclinical.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Error al cambiar el estado del paraclínico'),
      )
    },
  })
}
