import { useQuery } from '@tanstack/react-query'
import { fetchAllergySeverities } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useAllergySeverities() {
  return useQuery({
    queryKey: catalogsKeys.allergySeverities,
    queryFn: fetchAllergySeverities,
  })
}
