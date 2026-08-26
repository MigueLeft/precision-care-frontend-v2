import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteMapping } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteMappingOptions {
  onSuccess?: () => void
}

export function useDeleteMapping(questionnaireId: number, options?: UseDeleteMappingOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mappingId: number) => deleteMapping(mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Mapeo eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el mapeo'))
    },
  })
}
