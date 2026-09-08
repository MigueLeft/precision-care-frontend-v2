import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateParaclinical } from '../services/paraclinicals.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { ParaclinicalCatalog, UpdateParaclinicalPayload } from '../types'

interface UseUpdateParaclinicalOptions {
  onSuccess?: (paraclinical: ParaclinicalCatalog) => void
}

export function useUpdateParaclinical(
  id: number | undefined,
  options?: UseUpdateParaclinicalOptions,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateParaclinicalPayload) =>
      updateParaclinical(id as number, payload),
    onSuccess: (paraclinical) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.paraclinicals })
      toast.success('Paraclínico actualizado correctamente')
      options?.onSuccess?.(paraclinical)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el paraclínico'))
    },
  })
}
