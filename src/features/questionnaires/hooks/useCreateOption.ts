import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createOption } from '../services/questionnaire-builder.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateOptionPayload } from '../types'

interface UseCreateOptionOptions {
  onSuccess?: () => void
}

export function useCreateOption(questionnaireId: number, options?: UseCreateOptionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: number
      payload: CreateOptionPayload
    }) => createOption(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      toast.success('Opción agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la opción'))
    },
  })
}
