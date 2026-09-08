import { useQuery } from '@tanstack/react-query'
import { fetchParaclinicalOrdersByPatient } from '../services/paraclinical.service'
import { paraclinicalKeys } from './paraclinical.keys'

export function useParaclinicalOrdersByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: paraclinicalKeys.ordersByPatient(patientId ?? 0),
    queryFn: () => fetchParaclinicalOrdersByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
