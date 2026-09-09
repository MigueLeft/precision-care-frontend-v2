import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createDisease } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateDisease(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDisease,
    onSuccess: (disease) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.diseases })
      toast.success(`Enfermedad ${disease.name} creada correctamente`)
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la enfermedad'))
    },
  })
}
