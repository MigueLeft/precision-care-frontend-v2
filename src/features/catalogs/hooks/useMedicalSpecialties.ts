import { useQuery } from '@tanstack/react-query'
import { fetchMedicalSpecialties } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'

export function useMedicalSpecialties() {
  return useQuery({
    queryKey: catalogsKeys.medicalSpecialties,
    queryFn: fetchMedicalSpecialties,
  })
}
