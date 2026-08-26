import { useQuery } from '@tanstack/react-query'
import { fetchSymptoms } from '../services/symptoms.service'
import { catalogsKeys } from './catalogs.keys'

export function useSymptoms() {
  return useQuery({
    queryKey: catalogsKeys.symptoms,
    queryFn: fetchSymptoms,
  })
}
