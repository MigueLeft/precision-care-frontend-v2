import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createHospitalization } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateHospitalization(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHospitalization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.hospitalizationReasons })
      toast.success('Motivo de hospitalización creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el motivo de hospitalización'))
    },
  })
}
