import { useQuery } from '@tanstack/react-query'
import { fetchIntakeResponseDetail } from '../services/intake-responses.service'
import { intakeResponsesKeys } from './intake-responses.keys'

export function useIntakeResponseDetail(
  id: number | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: intakeResponsesKeys.detail(id ?? 0),
    queryFn: () => fetchIntakeResponseDetail(id as number),
    enabled: typeof id === 'number' && (options?.enabled ?? true),
  })
}
