import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateCountry } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateCountry(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name, isoCode }: { id: number; name: string; isoCode: string }) =>
      updateCountry(id, { name, isoCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.countries })
      toast.success('País actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el país'))
    },
  })
}
