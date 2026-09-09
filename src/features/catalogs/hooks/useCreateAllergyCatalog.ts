import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAllergyCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateAllergyCatalog(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAllergyCatalog,
    onSuccess: (allergy) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.allergies })
      toast.success(`Alergia ${allergy.name} creada correctamente`)
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la alergia'))
    },
  })
}
