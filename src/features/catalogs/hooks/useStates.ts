import { useQuery } from '@tanstack/react-query'
import { fetchStates } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

// staleTime 0: el catálogo de estados se edita con frecuencia y debe reflejarse
// de inmediato al volver al formulario de especialista tras agregar uno.
export function useStates(countryId?: number) {
  return useQuery({
    queryKey: countryId
      ? catalogsKeys.statesByCountry(countryId)
      : catalogsKeys.states,
    queryFn: () => fetchStates(countryId),
    staleTime: 0,
    enabled: countryId === undefined || countryId > 0,
  })
}
