import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleMedicalSpecialtyActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleMedicalSpecialtyActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleMedicalSpecialtyActive,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medicalSpecialties })
      toast.success(item.active ? `${item.name} marcada como activa` : `${item.name} marcada como inactiva`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la especialidad'))
    },
  })
}
