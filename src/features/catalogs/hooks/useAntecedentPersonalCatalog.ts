import { useQuery } from '@tanstack/react-query'
import { fetchAntecedentPersonalCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useAntecedentPersonalCatalog() {
  return useQuery({
    queryKey: catalogsKeys.antecedentPersonal,
    queryFn: fetchAntecedentPersonalCatalog,
    staleTime: CATALOG_STALE_TIME,
  })
}
