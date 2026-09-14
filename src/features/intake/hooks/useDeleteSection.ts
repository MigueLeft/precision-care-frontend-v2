import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteSection } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteSectionOptions {
  onSuccess?: () => void
}

export function useDeleteSection(intakeId: number, options?: UseDeleteSectionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: number) => deleteSection(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Sección eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la sección'))
    },
  })
}
