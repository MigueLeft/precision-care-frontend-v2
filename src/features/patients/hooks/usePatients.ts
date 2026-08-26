import { useQuery } from '@tanstack/react-query'
import { fetchPatients } from '../services/patients.service'
import { patientsKeys } from './patients.keys'

export function usePatients() {
  return useQuery({
    queryKey: patientsKeys.lists(),
    queryFn: fetchPatients,
  })
}
