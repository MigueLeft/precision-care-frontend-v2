import { api } from '@/utils/api'
import type {
  Consultation,
  ConsultationProblems,
  ConsultationDiagnosis,
  ConsultationSymptom,
  AddSymptomInput,
  CaptureSymptomInput,
  SymptomHistoryItem,
  PatientSymptom,
  ConsultationAllergy,
  AddAllergyInput,
  ConsultationDisease,
  AddDiseaseInput,
  UpdateDiseaseInput,
  ConsultationHistoryEntry,
  AllergyHistoryItem,
  DiseaseHistoryItem,
  ConsultationMedication,
  AddMedicationInput,
  CaptureMedicationInput,
  MedicationHistoryItem,
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
    | 'visitType'
  >
> & { problems?: ConsultationProblems }

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

export async function addConsultationSymptom(
  id: number,
  input: AddSymptomInput,
): Promise<ConsultationSymptom> {
  const { data } = await api.post<{ symptom: ConsultationSymptom }>(
    `/consultations/${id}/symptoms`,
    input,
  )
  return data.symptom
}

export async function captureConsultationSymptom(
  id: number,
  symptomId: number,
  input: CaptureSymptomInput,
): Promise<ConsultationSymptom> {
  const { data } = await api.patch<{ symptom: ConsultationSymptom }>(
    `/consultations/${id}/symptoms/${symptomId}`,
    input,
  )
  return data.symptom
}

export async function removeConsultationSymptom(
  id: number,
  symptomId: number,
): Promise<void> {
  await api.delete(`/consultations/${id}/symptoms/${symptomId}`)
}

export async function fetchConsultationSymptomHistory(
  id: number,
): Promise<ConsultationHistoryEntry<SymptomHistoryItem>[]> {
  const { data } = await api.get<{
    history: ConsultationHistoryEntry<SymptomHistoryItem>[]
  }>(`/consultations/${id}/symptom-history`)
  return data.history
}

// Todos los síntomas del paciente (una entrada por síntoma con versiones).
export async function fetchPatientSymptoms(
  patientId: number,
): Promise<PatientSymptom[]> {
  const { data } = await api.get<{ symptoms: PatientSymptom[] }>(
    `/consultations/patient/${patientId}/symptoms`,
  )
  return data.symptoms
}

// ─── Alergias ───────────────────────────────────────────────────────────────

export interface ConsultationAllergiesResponse {
  allergies: ConsultationAllergy[]
  noKnownAllergies: boolean
}

export async function fetchConsultationAllergies(
  id: number,
): Promise<ConsultationAllergiesResponse> {
  const { data } = await api.get<ConsultationAllergiesResponse>(
    `/consultations/${id}/allergies`,
  )
  return data
}

export async function addConsultationAllergy(
  id: number,
  input: AddAllergyInput,
): Promise<ConsultationAllergy> {
  const { data } = await api.post<{ allergy: ConsultationAllergy }>(
    `/consultations/${id}/allergies`,
    input,
  )
  return data.allergy
}

export async function removeConsultationAllergy(
  id: number,
  allergyId: number,
): Promise<void> {
  await api.delete(`/consultations/${id}/allergies/${allergyId}`)
}

export async function setNoKnownAllergies(
  id: number,
  value: boolean,
): Promise<void> {
  await api.patch(`/consultations/${id}/no-known-allergies`, { value })
}

export async function fetchConsultationAllergyHistory(
  id: number,
): Promise<ConsultationHistoryEntry<AllergyHistoryItem>[]> {
  const { data } = await api.get<{
    history: ConsultationHistoryEntry<AllergyHistoryItem>[]
  }>(`/consultations/${id}/allergy-history`)
  return data.history
}

// ─── Enfermedades / diagnósticos ────────────────────────────────────────────

export async function fetchConsultationDiseases(
  id: number,
): Promise<ConsultationDisease[]> {
  const { data } = await api.get<{ diseases: ConsultationDisease[] }>(
    `/consultations/${id}/diseases`,
  )
  return data.diseases
}

export async function addConsultationDisease(
  id: number,
  input: AddDiseaseInput,
): Promise<ConsultationDisease> {
  const { data } = await api.post<{ disease: ConsultationDisease }>(
    `/consultations/${id}/diseases`,
    input,
  )
  return data.disease
}

export async function updateConsultationDisease(
  id: number,
  diseaseId: number,
  input: UpdateDiseaseInput,
): Promise<ConsultationDisease> {
  const { data } = await api.patch<{ disease: ConsultationDisease }>(
    `/consultations/${id}/diseases/${diseaseId}`,
    input,
  )
  return data.disease
}

export async function removeConsultationDisease(
  id: number,
  diseaseId: number,
): Promise<void> {
  await api.delete(`/consultations/${id}/diseases/${diseaseId}`)
}

export async function fetchConsultationDiseaseHistory(
  id: number,
): Promise<ConsultationHistoryEntry<DiseaseHistoryItem>[]> {
  const { data } = await api.get<{
    history: ConsultationHistoryEntry<DiseaseHistoryItem>[]
  }>(`/consultations/${id}/disease-history`)
  return data.history
}

// ─── Tratamiento actual ─────────────────────────────────────────────────────

export async function fetchConsultationMedications(
  id: number,
): Promise<ConsultationMedication[]> {
  const { data } = await api.get<{ medications: ConsultationMedication[] }>(
    `/consultations/${id}/medications`,
  )
  return data.medications
}

export async function addConsultationMedication(
  id: number,
  input: AddMedicationInput,
): Promise<ConsultationMedication> {
  const { data } = await api.post<{ medication: ConsultationMedication }>(
    `/consultations/${id}/medications`,
    input,
  )
  return data.medication
}

export async function captureConsultationMedication(
  id: number,
  medicationId: number,
  input: CaptureMedicationInput,
): Promise<ConsultationMedication> {
  const { data } = await api.patch<{ medication: ConsultationMedication }>(
    `/consultations/${id}/medications/${medicationId}`,
    input,
  )
  return data.medication
}

export async function fetchConsultationMedicationHistory(
  id: number,
): Promise<ConsultationHistoryEntry<MedicationHistoryItem>[]> {
  const { data } = await api.get<{
    history: ConsultationHistoryEntry<MedicationHistoryItem>[]
  }>(`/consultations/${id}/medication-history`)
  return data.history
}

export interface ConsultationRecorded {
  diseases: ConsultationDisease[]
  medications: ConsultationMedication[]
}

export async function fetchConsultationRecorded(
  id: number,
): Promise<ConsultationRecorded> {
  const { data } = await api.get<ConsultationRecorded>(
    `/consultations/${id}/recorded`,
  )
  return data
}
