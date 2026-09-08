import { useConsultationsByPatient } from '@/features/consultations'
import { usePatientMedications, getCurrentMedications } from '@/features/patient-medications'
import { useParaclinicalResultsByPatient } from '@/features/paraclinical'
import { useQuestionnaireResponsesByPatient } from '@/features/questionnaire-responses'
import { useDeliverablesByPatient } from '@/features/deliverables'
import type { MedicalRecordCounts } from '../constants'

// Conteos para los badges del submenú.
export function useMedicalRecordCounts(patientId: number): MedicalRecordCounts {
  const { data: consultations } = useConsultationsByPatient(patientId)
  const { data: medications } = usePatientMedications(patientId)
  const { data: paraclinicalResults } = useParaclinicalResultsByPatient(patientId)
  const { data: questionnaires } = useQuestionnaireResponsesByPatient(patientId)
  const { data: deliverables } = useDeliverablesByPatient(patientId)

  return {
    consultas: consultations?.length,
    medicamentos: medications ? getCurrentMedications(medications).length : undefined,
    paraclinicos: paraclinicalResults?.length,
    ingresables: questionnaires?.length,
    entregables: deliverables?.length,
  }
}
