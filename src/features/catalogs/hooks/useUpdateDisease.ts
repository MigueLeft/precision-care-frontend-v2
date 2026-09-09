import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateDisease } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateDiseasePayload } from '../types'

export function useUpdateDisease(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDiseasePayload }) =>
      updateDisease(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.diseases })
      toast.success('Enfermedad actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la enfermedad'))
    },
  })
}
