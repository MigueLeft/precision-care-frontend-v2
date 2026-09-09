import { useQuery } from '@tanstack/react-query'
import { fetchPatientSymptoms } from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'

export function usePatientSymptoms(patientId: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.patientSymptoms(patientId ?? 0),
    queryFn: () => fetchPatientSymptoms(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
