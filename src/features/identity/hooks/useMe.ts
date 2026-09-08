import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '../services/me.service'
import { identityKeys } from './identity.keys'

// Usuario de la sesión actual (incluye specialistId para gates por especialista).
export function useMe() {
  return useQuery({
    queryKey: identityKeys.me,
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 10,
  })
}
