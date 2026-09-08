import { useQuery } from '@tanstack/react-query'
import { fetchPatientMedications } from '../services/patient-medications.service'
import { patientMedicationsKeys } from './patient-medications.keys'

export function usePatientMedications(patientId: number | undefined) {
  return useQuery({
    queryKey: patientMedicationsKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchPatientMedications(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
