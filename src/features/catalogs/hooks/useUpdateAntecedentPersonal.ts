import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAntecedentPersonal } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateAntecedentPersonal(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateAntecedentPersonal(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.antecedentPersonal })
      toast.success('Antecedente personal actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el antecedente personal'))
    },
  })
}
