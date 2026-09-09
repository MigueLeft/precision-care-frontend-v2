import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleDiseaseActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleDiseaseActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleDiseaseActive,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.diseases })
      toast.success(
        item.active ? `${item.name} marcada como activa` : `${item.name} marcada como inactiva`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la enfermedad'))
    },
  })
}
