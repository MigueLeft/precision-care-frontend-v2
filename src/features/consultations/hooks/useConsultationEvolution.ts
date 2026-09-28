import { useQuery } from '@tanstack/react-query'
import { fetchConsultationEvolution } from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'

export function useConsultationEvolution(id: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.evolution(id ?? 0),
    queryFn: () => fetchConsultationEvolution(id as number),
    enabled: typeof id === 'number',
  })
}
