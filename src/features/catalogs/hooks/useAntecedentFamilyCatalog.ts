import { useQuery } from '@tanstack/react-query'
import { fetchAntecedentFamilyCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useAntecedentFamilyCatalog() {
  return useQuery({
    queryKey: catalogsKeys.antecedentFamily,
    queryFn: fetchAntecedentFamilyCatalog,
    staleTime: CATALOG_STALE_TIME,
  })
}
