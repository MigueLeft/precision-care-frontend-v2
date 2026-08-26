import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteQuestionnaire } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteQuestionnaireOptions {
  onSuccess?: () => void
}

export function useDeleteQuestionnaire(options?: UseDeleteQuestionnaireOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteQuestionnaire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.lists() })
      toast.success('Ingresable eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el ingresable'))
    },
  })
}
