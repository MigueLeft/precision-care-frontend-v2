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
