import { useQuery } from '@tanstack/react-query'
import { fetchCivilStatuses } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useCivilStatuses() {
  return useQuery({
    queryKey: catalogsKeys.civilStatuses,
    queryFn: fetchCivilStatuses,
    staleTime: CATALOG_STALE_TIME,
  })
}
