import { useQuery } from '@tanstack/react-query'
import { fetchSocioeconomicLevels } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

export function useSocioeconomicLevels() {
  return useQuery({
    queryKey: catalogsKeys.socioeconomicLevels,
    queryFn: fetchSocioeconomicLevels,
    staleTime: CATALOG_STALE_TIME,
  })
}
