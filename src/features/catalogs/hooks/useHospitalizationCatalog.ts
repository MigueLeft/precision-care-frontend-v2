import { useQuery } from '@tanstack/react-query'
import { fetchHospitalizationCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useHospitalizationCatalog() {
  return useQuery({
    queryKey: catalogsKeys.hospitalizationReasons,
    queryFn: fetchHospitalizationCatalog,
    staleTime: CATALOG_STALE_TIME,
  })
}
