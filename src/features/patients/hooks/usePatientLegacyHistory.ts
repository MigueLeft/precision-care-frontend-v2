import { useQuery } from '@tanstack/react-query'
import { fetchPatientLegacyHistory } from '../services/patients.service'
import { patientsKeys } from './patients.keys'

export function usePatientLegacyHistory(patientId: number) {
  return useQuery({
    queryKey: patientsKeys.legacyHistory(patientId),
    queryFn: () => fetchPatientLegacyHistory(patientId),
  })
}
