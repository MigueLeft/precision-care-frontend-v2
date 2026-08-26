import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../services/users.service'
import { identityKeys } from './identity.keys'

export function useUsers() {
  return useQuery({
    queryKey: identityKeys.users,
    queryFn: fetchUsers,
  })
}
