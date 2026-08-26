import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleMedicationActive } from '../services/medications.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleMedicationActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleMedicationActive,
    onSuccess: (medication) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medications })
      toast.success(
        medication.active
          ? `${medication.brandName} marcado como activo`
          : `${medication.brandName} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado del medicamento'))
    },
  })
}
