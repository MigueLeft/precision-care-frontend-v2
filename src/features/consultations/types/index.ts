export type ConsultationStatus = 'in_progress' | 'completed'

export type DiagnosisType =
  | 'primary'
  | 'secondary'
  | 'presumptive'
  | 'definitive'
  | 'discarded'

export interface Consultation {
  id: number
  appointmentId: number
  specialistId: number
  patientId: number
  startAt: string
  endAt: string | null
  consultationReason: string | null
  currentIllness: string | null
  diagnosticPlan: string | null
  treatmentPlan: string | null
  evolution: string | null
  status: ConsultationStatus
  // Adjuntado por GET /consultations/patient/:patientId
  specialistName?: string | null
  createdAt: string
  updatedAt: string
}

export interface ConsultationDiagnosis {
  id: number
  consultationId: number
  name: string
  type: DiagnosisType
  notes: string | null
}

export interface ConsultationSymptom {
  id: number
  symptomCatalogId: number
  name: string | null
  bodySystemId: number | null
  bodySystemName: string | null
  notes: string | null
}

export interface ReplaceSymptomInput {
  name: string
  symptomCatalogId?: number
  bodySystemId?: number | null
  notes?: string
}

export interface SymptomHistoryEntry {
  consultationId: number
  date: string
  specialistName: string | null
  symptoms: { name: string | null; bodySystemName: string | null }[]
}

// ─── Alergias en la consulta ────────────────────────────────────────────────

export interface ConsultationAllergy {
  id: number
  patientId: number
  allergyCatalogId: number
  name: string | null
  typeId: number | null
  typeName: string | null
  severityId: number
  severityName: string | null
  consultationId: number | null
  reaction: string | null
  onsetYear: number | null
  createdAt: string
}

export interface AddAllergyInput {
  allergyCatalogId?: number
  name?: string
  typeId?: number
  severityId: number
  reaction?: string
  onsetYear?: number
}

// ─── Enfermedades / diagnósticos en la consulta ─────────────────────────────

export type DiseaseStatus = 'active' | 'controlled' | 'resolved' | 'discarded'

export interface ConsultationDisease {
  id: number
  patientId: number
  diseaseCatalogId: number
  name: string | null
  isChronic: boolean | null
  bodySystemId: number
  bodySystemName: string | null
  consultationId: number | null
  status: DiseaseStatus
  dxDate: string | null
  createdAt: string
}

export interface AddDiseaseInput {
  diseaseCatalogId?: number
  name?: string
  isChronic?: boolean
  bodySystemId: number
  status?: DiseaseStatus
  dxDate?: string
}

export interface UpdateDiseaseInput {
  bodySystemId?: number
  status?: DiseaseStatus
  dxDate?: string
}

// Bloque de histórico agrupado por la consulta en que se registró.
export interface ConsultationHistoryEntry<T> {
  consultationId: number
  date: string
  specialistName: string | null
  items: T[]
}

export interface AllergyHistoryItem {
  name: string | null
  typeName: string | null
  severityName: string | null
  reaction: string | null
}

export interface DiseaseHistoryItem {
  name: string | null
  bodySystemName: string | null
  status: DiseaseStatus
}
