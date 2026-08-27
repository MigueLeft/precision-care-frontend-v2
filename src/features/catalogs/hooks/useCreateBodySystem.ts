import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBodySystem } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateBodySystem(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBodySystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.bodySystems })
      toast.success('Aparato/sistema creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el aparato/sistema'))
    },
  })
}
