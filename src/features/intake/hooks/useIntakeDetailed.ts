import { useQuery } from '@tanstack/react-query'
import { fetchIntakeDetailed } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'

export function useIntakeDetailed(id: number) {
  return useQuery({
    queryKey: intakeKeys.detail(id),
    queryFn: () => fetchIntakeDetailed(id),
  })
}
