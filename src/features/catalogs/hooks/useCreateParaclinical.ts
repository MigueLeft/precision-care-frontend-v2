import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createParaclinical } from '../services/paraclinicals.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { ParaclinicalCatalog } from '../types'

interface UseCreateParaclinicalOptions {
  onSuccess?: (paraclinical: ParaclinicalCatalog) => void
}

export function useCreateParaclinical(options?: UseCreateParaclinicalOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createParaclinical,
    onSuccess: (paraclinical) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.paraclinicals })
      toast.success(`Paraclínico ${paraclinical.name} creado correctamente`)
      options?.onSuccess?.(paraclinical)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el paraclínico'))
    },
  })
}
