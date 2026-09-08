import { useQuery } from '@tanstack/react-query'
import { fetchCities } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

// staleTime 0: ver nota en useStates — el catálogo cambia y debe verse al instante.
export function useCities(stateId?: number) {
  return useQuery({
    queryKey: stateId ? catalogsKeys.citiesByState(stateId) : catalogsKeys.cities,
    queryFn: () => fetchCities(stateId),
    staleTime: 0,
    enabled: stateId === undefined || stateId > 0,
  })
}
