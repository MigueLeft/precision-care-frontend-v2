import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleExamCategoryActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleExamCategoryActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleExamCategoryActive,
    onSuccess: (examCategory) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.examCategories })
      toast.success(
        examCategory.active
          ? `${examCategory.name} marcada como activa`
          : `${examCategory.name} marcada como inactiva`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar la categoría de examen'))
    },
  })
}
