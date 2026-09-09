import { useQuery } from '@tanstack/react-query'
import { fetchDiseases } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useDiseases() {
  return useQuery({
    queryKey: catalogsKeys.diseases,
    queryFn: fetchDiseases,
  })
}
