import { useQuery } from '@tanstack/react-query'
import { fetchAllergyCatalog } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useAllergyCatalog() {
  return useQuery({
    queryKey: catalogsKeys.allergies,
    queryFn: fetchAllergyCatalog,
  })
}
