import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCountry } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateCountry(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.countries })
      toast.success('País creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el país'))
    },
  })
}
