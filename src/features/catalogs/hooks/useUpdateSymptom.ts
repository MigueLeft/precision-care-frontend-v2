import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSymptom } from '../services/symptoms.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { SymptomCatalog, UpdateSymptomPayload } from '../types'

interface UseUpdateSymptomOptions {
  onSuccess?: (symptom: SymptomCatalog) => void
}

export function useUpdateSymptom(id: number | undefined, options?: UseUpdateSymptomOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSymptomPayload) => updateSymptom(id as number, payload),
    onSuccess: (symptom) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.symptoms })
      toast.success('Síntoma actualizado correctamente')
      options?.onSuccess?.(symptom)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el síntoma'))
    },
  })
}
