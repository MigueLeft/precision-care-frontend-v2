import { useQuery } from '@tanstack/react-query'
import { fetchSymptomSeverities } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useSymptomSeverities() {
  return useQuery({
    queryKey: catalogsKeys.symptomSeverities,
    queryFn: fetchSymptomSeverities,
  })
}
