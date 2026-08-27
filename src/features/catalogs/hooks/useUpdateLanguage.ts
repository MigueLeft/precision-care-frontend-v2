import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateLanguage } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateLanguage(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name, isoCode }: { id: number; name: string; isoCode: string }) =>
      updateLanguage(id, { name, isoCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.languages })
      toast.success('Idioma actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el idioma'))
    },
  })
}
