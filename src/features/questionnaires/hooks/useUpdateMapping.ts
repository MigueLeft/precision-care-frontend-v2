import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateMapping } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UpdateMappingPayload } from '../types'

interface UseUpdateMappingOptions {
  onSuccess?: () => void
}

export function useUpdateMapping(questionnaireId: number, options?: UseUpdateMappingOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mappingId, payload }: { mappingId: number; payload: UpdateMappingPayload }) =>
      updateMapping(mappingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Mapeo actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el mapeo'))
    },
  })
}
