import { useQuery } from '@tanstack/react-query'
import { fetchPublicIntakeResponse } from '../services/intake-fill.service'

export function usePublicIntakeResponse(token: string) {
  return useQuery({
    queryKey: ['public-intake-response', token] as const,
    queryFn: () => fetchPublicIntakeResponse(token),
    enabled: token.length > 0,
    retry: false,
  })
}
