import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSymptomSeverity } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateSymptomSeverity(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSymptomSeverity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.symptomSeverities })
      toast.success('Severidad creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la severidad'))
    },
  })
}
