import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSection } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateSectionPayload } from '../types'

interface UseUpdateSectionOptions {
  onSuccess?: () => void
}

export function useUpdateSection(questionnaireId: number, options?: UseUpdateSectionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: number; payload: UpdateSectionPayload }) =>
      updateSection(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Sección actualizada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la sección'))
    },
  })
}
