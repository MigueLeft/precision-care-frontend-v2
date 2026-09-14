import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSurgery } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateSurgery(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateSurgery(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.surgeries })
      toast.success('Cirugía actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la cirugía'))
    },
  })
}
