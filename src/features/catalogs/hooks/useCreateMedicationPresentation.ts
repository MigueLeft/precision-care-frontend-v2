import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMedicationPresentation } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateMedicationPresentation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicationPresentation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medicationPresentations })
      toast.success('Presentación creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la presentación'))
    },
  })
}
