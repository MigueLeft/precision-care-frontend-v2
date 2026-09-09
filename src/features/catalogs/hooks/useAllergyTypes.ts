import { useQuery } from '@tanstack/react-query'
import { fetchAllergyTypes } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useAllergyTypes() {
  return useQuery({
    queryKey: catalogsKeys.allergyTypes,
    queryFn: fetchAllergyTypes,
  })
}
