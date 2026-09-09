import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAllergyCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateAllergyCatalogPayload } from '../types'

export function useUpdateAllergyCatalog(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAllergyCatalogPayload }) =>
      updateAllergyCatalog(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.allergies })
      toast.success('Alergia actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la alergia'))
    },
  })
}
