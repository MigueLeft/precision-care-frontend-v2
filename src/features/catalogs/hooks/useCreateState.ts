import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createState } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateState(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.states })
      toast.success('Estado creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el estado'))
    },
  })
}
