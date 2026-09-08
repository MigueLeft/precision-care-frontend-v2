import { useQuery } from '@tanstack/react-query'
import { fetchPatient } from '../services/patients.service'
import { patientsKeys } from './patients.keys'

export function usePatient(patientId: number | undefined) {
  return useQuery({
    queryKey: patientsKeys.detail(patientId ?? 0),
    queryFn: () => fetchPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
