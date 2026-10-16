import { useQuery } from '@tanstack/react-query'
import { fetchAntecedentsByPatient } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
import { useDraftConsultationId } from '@/hooks/draft-consultation'

// Dentro de una consulta en curso incluye su borrador.
export function useAntecedentsByPatient(patientId: number | undefined) {
  const consultationId = useDraftConsultationId()
  return useQuery({
    queryKey: antecedentsKeys.byPatient(patientId ?? 0, consultationId),
    queryFn: () => fetchAntecedentsByPatient(patientId as number, consultationId),
    enabled: typeof patientId === 'number',
  })
}
