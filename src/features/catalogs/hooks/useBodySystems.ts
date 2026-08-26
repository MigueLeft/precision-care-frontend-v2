import { useQuery } from '@tanstack/react-query'
import { fetchBodySystems } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useBodySystems() {
  return useQuery({
    queryKey: catalogsKeys.bodySystems,
    queryFn: fetchBodySystems,
    staleTime: CATALOG_STALE_TIME,
  })
}
