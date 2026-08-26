import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMapping } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateMappingPayload } from '../types'

interface UseCreateMappingOptions {
  onSuccess?: () => void
}

export function useCreateMapping(questionnaireId: number, options?: UseCreateMappingOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: number; payload: CreateMappingPayload }) =>
      createMapping(versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Mapeo agregado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar el mapeo'))
    },
  })
}
