import { useQuery } from '@tanstack/react-query'
import { fetchRaces } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useRaces() {
  return useQuery({
    queryKey: catalogsKeys.races,
    queryFn: fetchRaces,
    staleTime: CATALOG_STALE_TIME,
  })
}
