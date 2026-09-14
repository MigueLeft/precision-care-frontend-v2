import { useQuery } from '@tanstack/react-query'
import { fetchSurgeryCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useSurgeryCatalog() {
  return useQuery({
    queryKey: catalogsKeys.surgeries,
    queryFn: fetchSurgeryCatalog,
    staleTime: CATALOG_STALE_TIME,
  })
}
