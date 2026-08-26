import { useQuery } from '@tanstack/react-query'
import { fetchLanguages } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useLanguages() {
  return useQuery({
    queryKey: catalogsKeys.languages,
    queryFn: fetchLanguages,
    staleTime: CATALOG_STALE_TIME,
  })
}
