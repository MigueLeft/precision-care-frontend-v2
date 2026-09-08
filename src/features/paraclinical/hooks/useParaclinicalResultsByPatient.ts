import { useQuery } from '@tanstack/react-query'
import { fetchParaclinicalResultsByPatient } from '../services/paraclinical.service'
import { paraclinicalKeys } from './paraclinical.keys'

export function useParaclinicalResultsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: paraclinicalKeys.resultsByPatient(patientId ?? 0),
    queryFn: () => fetchParaclinicalResultsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
