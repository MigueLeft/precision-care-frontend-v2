import { useQuery } from '@tanstack/react-query'
import { fetchParaclinicalResultsByPatient } from '../services/paraclinical.service'
import { paraclinicalKeys } from './paraclinical.keys'

export function useParaclinicalResultsByPatient(
  patientId: number | undefined,
  consultationId?: number,
) {
  return useQuery({
    queryKey: paraclinicalKeys.resultsByPatient(patientId ?? 0, consultationId),
    queryFn: () => fetchParaclinicalResultsByPatient(patientId as number, consultationId),
    enabled: typeof patientId === 'number',
  })
}
