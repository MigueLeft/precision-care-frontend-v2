import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleSurgeryActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleSurgeryActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleSurgeryActive,
    onSuccess: (surgery) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.surgeries })
      toast.success(
        surgery.active ? `${surgery.name} marcada como activa` : `${surgery.name} marcada como inactiva`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la cirugía'))
    },
  })
}
