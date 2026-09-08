import { useQuery } from '@tanstack/react-query'
import { fetchStates } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

// Sin `countryId` devuelve todos los estados; con `countryId` filtra por país.
export function useStates(countryId?: number) {
  return useQuery({
    queryKey: countryId
      ? catalogsKeys.statesByCountry(countryId)
      : catalogsKeys.states,
    queryFn: () => fetchStates(countryId),
    staleTime: CATALOG_STALE_TIME,
    enabled: countryId === undefined || countryId > 0,
  })
}
