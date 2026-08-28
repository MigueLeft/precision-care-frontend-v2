import { useQuery } from '@tanstack/react-query'
import { fetchMedicationPresentations } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useMedicationPresentations() {
  return useQuery({
    queryKey: catalogsKeys.medicationPresentations,
    queryFn: fetchMedicationPresentations,
  })
}
