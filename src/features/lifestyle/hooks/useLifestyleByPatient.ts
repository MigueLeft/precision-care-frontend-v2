import { useQuery } from '@tanstack/react-query'
import { fetchLifestyleByPatient } from '../services/lifestyle.service'
import { lifestyleKeys } from './lifestyle.keys'

export function useLifestyleByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: lifestyleKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchLifestyleByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
