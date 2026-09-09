import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchBodyCompositionsByPatient,
  fetchBodyCompositionByConsultation,
  createBodyComposition,
  updateBodyComposition,
} from '../services/body-composition.service'
import { bodyCompositionKeys } from './body-composition.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { SaveBodyCompositionInput } from '../types'

export function useBodyCompositionsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: bodyCompositionKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchBodyCompositionsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}

export function useBodyCompositionByConsultation(consultationId: number) {
  return useQuery({
    queryKey: bodyCompositionKeys.byConsultation(consultationId),
    queryFn: () => fetchBodyCompositionByConsultation(consultationId),
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: bodyCompositionKeys.all })
}

export function useSaveBodyComposition(
  existingId: number | undefined,
  options?: { onSuccess?: () => void },
) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ patientId, consultationId, ...rest }: SaveBodyCompositionInput) =>
      existingId
        ? updateBodyComposition(existingId, rest)
        : createBodyComposition({ patientId, consultationId, ...rest }),
    onSuccess: () => {
      invalidate()
      toast.success('Composición corporal guardada')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la composición corporal'))
    },
  })
}
