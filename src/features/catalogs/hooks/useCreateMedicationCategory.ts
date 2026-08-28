import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMedicationCategory } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateMedicationCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicationCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medicationCategories })
      toast.success('Categoría creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la categoría'))
    },
  })
}
