import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSurgery } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateSurgery(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSurgery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.surgeries })
      toast.success('Cirugía creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la cirugía'))
    },
  })
}
