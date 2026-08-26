import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSymptom } from '../services/symptoms.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { SymptomCatalog } from '../types'

interface UseCreateSymptomOptions {
  onSuccess?: (symptom: SymptomCatalog) => void
}

export function useCreateSymptom(options?: UseCreateSymptomOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSymptom,
    onSuccess: (symptom) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.symptoms })
      toast.success(`Síntoma ${symptom.name} creado correctamente`)
      options?.onSuccess?.(symptom)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el síntoma'))
    },
  })
}
