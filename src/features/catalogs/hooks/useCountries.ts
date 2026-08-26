import { useQuery } from '@tanstack/react-query'
import { fetchCountries } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useCountries() {
  return useQuery({
    queryKey: catalogsKeys.countries,
    queryFn: fetchCountries,
    staleTime: CATALOG_STALE_TIME,
  })
}
