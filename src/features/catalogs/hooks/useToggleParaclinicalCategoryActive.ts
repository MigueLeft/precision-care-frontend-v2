import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleParaclinicalCategoryActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleParaclinicalCategoryActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleParaclinicalCategoryActive,
    onSuccess: (category) => {
      queryClient.invalidateQueries({
        queryKey: catalogsKeys.paraclinicalCategories,
      })
      toast.success(
        category.active
          ? `${category.name} marcada como activa`
          : `${category.name} marcada como inactiva`,
      )
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Error al cambiar la categoría de paraclínico'),
      )
    },
  })
}
