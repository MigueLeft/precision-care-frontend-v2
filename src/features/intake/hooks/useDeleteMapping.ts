import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteMapping } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteMappingOptions {
  onSuccess?: () => void
}

export function useDeleteMapping(intakeId: number, options?: UseDeleteMappingOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mappingId: number) => deleteMapping(mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Mapeo eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el mapeo'))
    },
  })
}
