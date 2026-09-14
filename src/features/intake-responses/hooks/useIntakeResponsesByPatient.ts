import { useQuery } from '@tanstack/react-query'
import { fetchIntakeResponsesByPatient } from '../services/intake-responses.service'
import { intakeResponsesKeys } from './intake-responses.keys'

export function useIntakeResponsesByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: intakeResponsesKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchIntakeResponsesByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
