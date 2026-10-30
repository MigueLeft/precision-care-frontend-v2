import { useAntecedentsByPatient } from '@/features/antecedents'
import { canViewRisk, useMe } from '@/features/identity'
import { useAnthropometryByConsultation } from '@/features/anthropometry'
import { useLifestyleByPatient } from '@/features/lifestyle'
import { useParaclinicalResultsByPatient } from '@/features/paraclinical'
import { useRiskOverview } from '@/features/risk'
import type { ClinicalSectionId } from '../components/workspace/workspace-sections'
import { useConsultationSymptoms } from './useConsultationDetail'
import { useConsultationAllergies } from './useConsultationAllergies'
import { useConsultationDiseases } from './useConsultationDiseases'
import { useConsultationMedications } from './useConsultationMedications'
import type { Consultation } from '../types'

// Apartados revisados: los que ya tienen información cargada en esta consulta
// (o en el expediente, para lo que no se captura por consulta).
export function useSectionCompletion(consultation: Consultation): Record<ClinicalSectionId, boolean> {
  const { id, patientId, startAt } = consultation
  const { data: antecedents = [] } = useAntecedentsByPatient(patientId)
  const { data: allergies } = useConsultationAllergies(id)
  const { data: symptoms = [] } = useConsultationSymptoms(id)
  const { data: medications = [] } = useConsultationMedications(id)
  const { data: anthropometry } = useAnthropometryByConsultation(id)
  const { data: results = [] } = useParaclinicalResultsByPatient(patientId, id)
  const { data: diseases = [] } = useConsultationDiseases(id)
  const { data: me } = useMe()
  // Sin permiso de riesgo no se consulta (el apartado tampoco se muestra).
  const { data: risk } = useRiskOverview(patientId, canViewRisk(me))
  const { data: lifestyle = [] } = useLifestyleByPatient(patientId)

  const started = new Date(startAt).getTime()

  return {
    antecedents:
      antecedents.length + (allergies?.allergies.length ?? 0) > 0 || !!allergies?.noKnownAllergies,
    symptoms: symptoms.some((symptom) => symptom.capturedHere),
    treatment: medications.some((medication) => medication.consultationId === id),
    anthropometry: !!anthropometry,
    physicalExam: consultation.physicalExam != null,
    paraclinical: results.some((result) => new Date(result.createdAt).getTime() >= started),
    diagnoses: diseases.some((disease) => disease.consultationId === id),
    risk: !!risk?.confirmation,
    nutrition: false,
    lifestyle: lifestyle.length > 0,
    problems: (consultation.problems?.actuales.length ?? 0) + (consultation.problems?.previos.length ?? 0) > 0,
  }
}
