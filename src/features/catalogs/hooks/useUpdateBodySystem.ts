import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateBodySystem } from '../services/catalogs.service'
import type { BodySystemPayload } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateBodySystem(id: number | undefined, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BodySystemPayload) => {
      if (!id) throw new Error('Falta el ID del aparato/sistema a actualizar.')
      return updateBodySystem(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.bodySystems })
      toast.success('Aparato/sistema actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el aparato/sistema'))
    },
  })
}
