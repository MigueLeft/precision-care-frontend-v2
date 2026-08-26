import { useQuery } from '@tanstack/react-query'
import { fetchPermissions } from '../services/permissions.service'
import { identityKeys } from './identity.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function usePermissions() {
  return useQuery({
    queryKey: identityKeys.permissions,
    queryFn: fetchPermissions,
    staleTime: CATALOG_STALE_TIME,
  })
}
