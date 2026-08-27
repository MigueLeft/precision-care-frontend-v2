import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCie10 } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateCie10(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCie10,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.cie10 })
      toast.success('Código CIE-10 creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el código CIE-10'))
    },
  })
}
