import { useQuery } from '@tanstack/react-query'
import { fetchPrescriptionsByConsultation } from '../services/prescriptions.service'
import { patientMedicationsKeys } from './patient-medications.keys'

export function usePrescriptionsByConsultation(consultationId: number | undefined) {
  return useQuery({
    queryKey: [...patientMedicationsKeys.all, 'prescriptions', consultationId ?? 0],
    queryFn: () => fetchPrescriptionsByConsultation(consultationId as number),
    enabled: typeof consultationId === 'number',
  })
}
