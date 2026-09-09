import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleAllergyTypeActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleAllergyTypeActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleAllergyTypeActive,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.allergyTypes })
      toast.success(
        item.active ? `${item.name} marcado como activo` : `${item.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el tipo de alergia'))
    },
  })
}
