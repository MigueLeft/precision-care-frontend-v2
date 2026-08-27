import { useQuery } from '@tanstack/react-query'
import { fetchCie10 } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useCie10() {
  return useQuery({
    queryKey: catalogsKeys.cie10,
    queryFn: fetchCie10,
    staleTime: CATALOG_STALE_TIME,
  })
}
