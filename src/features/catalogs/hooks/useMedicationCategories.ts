import { useQuery } from '@tanstack/react-query'
import { fetchMedicationCategories } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useMedicationCategories() {
  return useQuery({
    queryKey: catalogsKeys.medicationCategories,
    queryFn: fetchMedicationCategories,
  })
}
