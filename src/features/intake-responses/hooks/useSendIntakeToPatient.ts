import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendIntakeToPatient } from '../services/intake-responses.service'
import { intakeResponsesKeys } from './intake-responses.keys'

export function useSendIntakeToPatient(patientId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (intakeVersionId: number) =>
      sendIntakeToPatient(patientId, intakeVersionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: intakeResponsesKeys.byPatient(patientId),
      })
    },
  })
}
