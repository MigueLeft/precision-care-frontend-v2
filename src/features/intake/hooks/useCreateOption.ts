import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createOption } from '../services/intake-builder.service'
import { intakeKeys } from './intake.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreateOptionPayload } from '../types'

interface UseCreateOptionOptions {
  onSuccess?: () => void
}

export function useCreateOption(intakeId: number, options?: UseCreateOptionOptions) {
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
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) })
      toast.success('Opción agregada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar la opción'))
    },
  })
}
