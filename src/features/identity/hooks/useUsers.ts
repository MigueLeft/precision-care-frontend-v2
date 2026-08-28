import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../services/users.service'
import { identityKeys } from './identity.keys'

export function useUsers(includeDeleted = false) {
  return useQuery({
    queryKey: [...identityKeys.users, { includeDeleted }] as const,
    queryFn: () => fetchUsers(includeDeleted),
  })
}
