import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteSection } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteSectionOptions {
  onSuccess?: () => void
}

export function useDeleteSection(questionnaireId: number, options?: UseDeleteSectionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: number) => deleteSection(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Sección eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la sección'))
    },
  })
}
