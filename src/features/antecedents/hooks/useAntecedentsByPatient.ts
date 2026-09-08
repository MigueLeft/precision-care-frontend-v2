import { useQuery } from '@tanstack/react-query'
import { fetchAntecedentsByPatient } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'

export function useAntecedentsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: antecedentsKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchAntecedentsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
