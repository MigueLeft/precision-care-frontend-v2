import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleMedicationCategoryActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleMedicationCategoryActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleMedicationCategoryActive,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medicationCategories })
      toast.success(item.active ? `${item.name} marcada como activa` : `${item.name} marcada como inactiva`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la categoría'))
    },
  })
}
