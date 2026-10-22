import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { createAllergySeverity } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateAllergySeverity(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAllergySeverity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.allergySeverities })
      toast.success('Severidad creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la severidad'))
    },
  })
}
