import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAntecedentPersonal } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateAntecedentPersonal(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAntecedentPersonal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.antecedentPersonal })
      toast.success('Antecedente personal creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el antecedente personal'))
    },
  })
}
