import { useQuery } from '@tanstack/react-query'
import { fetchPatientAllergies } from '../services/patients.service'
import { patientsKeys } from './patients.keys'

export function usePatientAllergies(patientId: number | undefined) {
  return useQuery({
    queryKey: patientsKeys.allergies(patientId ?? 0),
    queryFn: () => fetchPatientAllergies(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
