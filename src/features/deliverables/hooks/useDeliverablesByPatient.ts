import { useQuery } from '@tanstack/react-query'
import { fetchDeliverablesByPatient } from '../services/deliverables.service'
import { deliverablesKeys } from './deliverables.keys'

export function useDeliverablesByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: deliverablesKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchDeliverablesByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
