import { useQuery } from '@tanstack/react-query'
import { fetchRoles } from '../services/roles.service'
import { identityKeys } from './identity.keys'

export function useRoles() {
  return useQuery({
    queryKey: identityKeys.roles,
    queryFn: fetchRoles,
  })
}
