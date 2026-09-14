import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleHospitalizationActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleHospitalizationActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleHospitalizationActive,
    onSuccess: (hospitalization) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.hospitalizationReasons })
      toast.success(
        hospitalization.active
          ? `${hospitalization.name} marcado como activo`
          : `${hospitalization.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el motivo de hospitalización'))
    },
  })
}
