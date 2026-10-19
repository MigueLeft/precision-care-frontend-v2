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

// Para el expediente: una consulta en curso es un borrador y no se muestra
// hasta que se finaliza.
export function useCompletedConsultations(patientId: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchConsultationsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
    select: (consultations) => consultations.filter((c) => c.status === 'completed'),
  })
}
