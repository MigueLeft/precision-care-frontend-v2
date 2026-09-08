import { useQuery } from '@tanstack/react-query'
import { fetchCities } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

const CATALOG_STALE_TIME = 1000 * 60 * 60

// Sin `stateId` devuelve todas las ciudades; con `stateId` filtra por estado.
export function useCities(stateId?: number) {
  return useQuery({
    queryKey: stateId ? catalogsKeys.citiesByState(stateId) : catalogsKeys.cities,
    queryFn: () => fetchCities(stateId),
    staleTime: CATALOG_STALE_TIME,
    enabled: stateId === undefined || stateId > 0,
  })
}
