import { useQuery } from '@tanstack/react-query'
import { fetchBodyCompositionsByPatient } from '../services/body-composition.service'
import { bodyCompositionKeys } from './body-composition.keys'

export function useBodyCompositionsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: bodyCompositionKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchBodyCompositionsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
