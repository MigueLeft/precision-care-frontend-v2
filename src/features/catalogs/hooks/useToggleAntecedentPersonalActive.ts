import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleAntecedentPersonalActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleAntecedentPersonalActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleAntecedentPersonalActive,
    onSuccess: (antecedentPersonal) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.antecedentPersonal })
      toast.success(
        antecedentPersonal.active
          ? `${antecedentPersonal.name} marcado como activo`
          : `${antecedentPersonal.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el antecedente personal'))
    },
  })
}
