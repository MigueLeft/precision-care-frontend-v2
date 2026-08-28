import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createExamCategory } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateExamCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExamCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.examCategories })
      toast.success('Categoría de examen creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la categoría de examen'))
    },
  })
}
