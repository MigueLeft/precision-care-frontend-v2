import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleSymptomActive } from '../services/symptoms.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleSymptomActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleSymptomActive,
    onSuccess: (symptom) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.symptoms })
      toast.success(
        symptom.active ? `${symptom.name} marcado como activo` : `${symptom.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado del síntoma'))
    },
  })
}
