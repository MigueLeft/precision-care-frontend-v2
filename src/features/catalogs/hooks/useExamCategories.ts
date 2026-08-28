import { useQuery } from '@tanstack/react-query'
import { fetchExamCategories } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useExamCategories() {
  return useQuery({
    queryKey: catalogsKeys.examCategories,
    queryFn: fetchExamCategories,
  })
}
