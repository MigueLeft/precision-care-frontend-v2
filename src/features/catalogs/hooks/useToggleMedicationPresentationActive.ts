import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleMedicationPresentationActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleMedicationPresentationActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleMedicationPresentationActive,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medicationPresentations })
      toast.success(item.active ? `${item.name} marcada como activa` : `${item.name} marcada como inactiva`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la presentación'))
    },
  })
}
