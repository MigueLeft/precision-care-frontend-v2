import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAllergyType } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateAllergyType(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateAllergyType(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.allergyTypes })
      toast.success('Tipo de alergia actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el tipo de alergia'))
    },
  })
}
