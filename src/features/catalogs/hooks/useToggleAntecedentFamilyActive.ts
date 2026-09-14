import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleAntecedentFamilyActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleAntecedentFamilyActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleAntecedentFamilyActive,
    onSuccess: (antecedentFamily) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.antecedentFamily })
      toast.success(
        antecedentFamily.active
          ? `${antecedentFamily.name} marcado como activo`
          : `${antecedentFamily.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el antecedente familiar'))
    },
  })
}
