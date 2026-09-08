import { api } from '@/utils/api'
import type {
  Consultation,
  ConsultationDiagnosis,
  ConsultationSymptom,
  ReplaceSymptomInput,
  SymptomHistoryEntry,
} from '../types'

export async function fetchConsultationsByPatient(
  patientId: number,
): Promise<Consultation[]> {
  const { data } = await api.get<{ consultations: Consultation[] }>(
    `/consultations/patient/${patientId}`,
  )
  return data.consultations
}

export async function fetchConsultation(id: number): Promise<Consultation> {
  const { data } = await api.get<{ consultation: Consultation }>(
    `/consultations/${id}`,
  )
  return data.consultation
}

export async function fetchConsultationByAppointment(
  appointmentId: number,
): Promise<Consultation | null> {
  const { data } = await api.get<{ consultation: Consultation | null }>(
    `/consultations/appointment/${appointmentId}`,
  )
  return data.consultation
}

export type UpdateConsultationPatch = Partial<
  Pick<
    Consultation,
    | 'consultationReason'
    | 'currentIllness'
    | 'diagnosticPlan'
    | 'treatmentPlan'
    | 'evolution'
    | 'status'
  >
>

export async function updateConsultation(
  id: number,
  patch: UpdateConsultationPatch,
): Promise<Consultation> {
  const { data } = await api.patch<{ consultation: Consultation }>(
    `/consultations/${id}`,
    patch,
  )
  return data.consultation
}

export async function fetchConsultationDiagnoses(
  id: number,
): Promise<ConsultationDiagnosis[]> {
  const { data } = await api.get<{ diagnoses: ConsultationDiagnosis[] }>(
    `/consultations/${id}/diagnoses`,
  )
  return data.diagnoses
}

export async function fetchConsultationSymptoms(
  id: number,
): Promise<ConsultationSymptom[]> {
  const { data } = await api.get<{ symptoms: ConsultationSymptom[] }>(
    `/consultations/${id}/symptoms`,
  )
  return data.symptoms
}

export async function replaceConsultationSymptoms(
  id: number,
  symptoms: ReplaceSymptomInput[],
): Promise<ConsultationSymptom[]> {
  const { data } = await api.put<{ symptoms: ConsultationSymptom[] }>(
    `/consultations/${id}/symptoms`,
    { symptoms },
  )
  return data.symptoms
}

export async function fetchConsultationSymptomHistory(
  id: number,
): Promise<SymptomHistoryEntry[]> {
  const { data } = await api.get<{ history: SymptomHistoryEntry[] }>(
    `/consultations/${id}/symptom-history`,
  )
  return data.history
}
