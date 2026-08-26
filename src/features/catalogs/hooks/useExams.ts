import { useQuery } from '@tanstack/react-query'
import { fetchExams } from '../services/exams.service'
import { catalogsKeys } from './catalogs.keys'

export function useExams() {
  return useQuery({
    queryKey: catalogsKeys.exams,
    queryFn: fetchExams,
  })
}
