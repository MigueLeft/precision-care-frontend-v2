import { useQuery } from '@tanstack/react-query'
import { fetchConsultationsByPatient } from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'

export function useConsultationsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchConsultationsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
