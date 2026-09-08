import { useQuery } from '@tanstack/react-query'
import { fetchParaclinicalCategories } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useParaclinicalCategories() {
  return useQuery({
    queryKey: catalogsKeys.paraclinicalCategories,
    queryFn: fetchParaclinicalCategories,
  })
}
