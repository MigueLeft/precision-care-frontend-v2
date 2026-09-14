import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAntecedentFamily } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateAntecedentFamily(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateAntecedentFamily(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.antecedentFamily })
      toast.success('Antecedente familiar actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el antecedente familiar'))
    },
  })
}
