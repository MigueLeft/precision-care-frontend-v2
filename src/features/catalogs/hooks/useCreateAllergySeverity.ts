import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAllergySeverity } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateAllergySeverity(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAllergySeverity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.allergySeverities })
      toast.success('Gravedad creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la gravedad'))
    },
  })
}
