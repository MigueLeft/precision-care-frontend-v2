import { useQuery } from '@tanstack/react-query'
import { fetchMedications } from '../services/medications.service'
import { catalogsKeys } from './catalogs.keys'

export function useMedications() {
  return useQuery({
    queryKey: catalogsKeys.medications,
    queryFn: fetchMedications,
  })
}
