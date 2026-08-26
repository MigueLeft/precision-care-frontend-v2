import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteOption } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteOptionOptions {
  onSuccess?: () => void
}

export function useDeleteOption(questionnaireId: number, options?: UseDeleteOptionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (optionId: number) => deleteOption(optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Opción eliminada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la opción'))
    },
  })
}
