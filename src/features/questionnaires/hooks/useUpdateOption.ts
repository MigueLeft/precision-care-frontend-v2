import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateOption } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateOptionPayload } from '../types'

interface UseUpdateOptionOptions {
  onSuccess?: () => void
}

export function useUpdateOption(questionnaireId: number, options?: UseUpdateOptionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ optionId, payload }: { optionId: number; payload: UpdateOptionPayload }) =>
      updateOption(optionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Opción actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la opción'))
    },
  })
}
