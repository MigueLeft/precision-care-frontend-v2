import { useQuery } from '@tanstack/react-query'
import { fetchIntakes } from '../services/intakes.service'
import { intakeKeys } from './intake.keys'

export function useIntakes() {
  return useQuery({
    queryKey: intakeKeys.lists(),
    queryFn: fetchIntakes,
  })
}
