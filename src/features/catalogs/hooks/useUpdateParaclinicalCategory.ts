import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateParaclinicalCategory } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateParaclinicalCategoryPayload } from '../types'

export function useUpdateParaclinicalCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateParaclinicalCategoryPayload
    }) => updateParaclinicalCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: catalogsKeys.paraclinicalCategories,
      })
      toast.success('Categoría de paraclínico actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          'Error al actualizar la categoría de paraclínico',
        ),
      )
    },
  })
}
