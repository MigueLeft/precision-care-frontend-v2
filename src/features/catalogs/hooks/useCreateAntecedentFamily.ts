import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAntecedentFamily } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateAntecedentFamily(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAntecedentFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.antecedentFamily })
      toast.success('Antecedente familiar creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el antecedente familiar'))
    },
  })
}
