import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createParaclinicalCategory } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateParaclinicalCategoryPayload } from '../types'

export function useCreateParaclinicalCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateParaclinicalCategoryPayload) =>
      createParaclinicalCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: catalogsKeys.paraclinicalCategories,
      })
      toast.success('Categoría de paraclínico creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Error al crear la categoría de paraclínico'),
      )
    },
  })
}
