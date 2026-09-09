export type ConsultationStatus = 'in_progress' | 'completed'

export type VisitType = 'first' | 'subsequent'

export type DiagnosisType =
  | 'primary'
  | 'secondary'
  | 'presumptive'
  | 'definitive'
  | 'discarded'

// Lista de problemas del Cierre Clínico (widget "Problemas").
export interface ConsultationProblems {
  actuales: string[]
  previos: string[]
}

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
  problems: ConsultationProblems | null
  status: ConsultationStatus
  visitType: VisitType
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

export type SymptomStatus =
  | 'active'
  | 'under_investigation'
  | 'discarded'
  | 'controlled'
  | 'resolved'

export interface ConsultationSymptom {
  id: number
  consultationId: number | null
  patientId: number
  symptomCatalogId: number
  name: string | null
  symptomSeverityId: number | null
  severityName: string | null
  patientDiseaseId: number | null
  diseaseName: string | null
  status: SymptomStatus
  // Fecha de inicio (texto libre); por defecto la de la consulta.
  onsetDate: string | null
  notes: string | null
  createdAt: string
  // true si la versión vigente se capturó en esta consulta.
  capturedHere: boolean
}

export interface AddSymptomInput {
  symptomCatalogId?: number
  name?: string
  symptomSeverityId?: number
  patientDiseaseId?: number
  status?: SymptomStatus
  onsetDate?: string
  notes?: string
}

export interface CaptureSymptomInput {
  symptomSeverityId?: number | null
  patientDiseaseId?: number | null
  status?: SymptomStatus
  onsetDate?: string
  notes?: string
}

export interface SymptomHistoryItem {
  name: string | null
  severityName: string | null
  diseaseName: string | null
  status: SymptomStatus
  onsetDate: string | null
}

// Expediente: una entrada por síntoma con su historial de versiones.
export interface PatientSymptom {
  id: number
  symptomCatalogId: number
  name: string | null
  severityName: string | null
  diseaseName: string | null
  status: SymptomStatus
  createdAt: string
  onsetDate: string | null
  versions: {
    id: number
    consultationId: number | null
    severityName: string | null
    diseaseName: string | null
    status: SymptomStatus
    onsetDate: string | null
    notes: string | null
    createdAt: string
  }[]
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

export type DiseaseStatus =
  | 'active'
  | 'controlled'
  | 'remission'
  | 'resolved'
  | 'discarded'
  | 'to_diagnose'

export interface ConsultationDisease {
  id: number
  patientId: number
  diseaseCatalogId: number
  name: string | null
  code: string | null
  isChronic: boolean | null
  bodySystemId: number
  bodySystemName: string | null
  consultationId: number | null
  status: DiseaseStatus
  dxDate: string | null
  notes: string | null
  createdAt: string
}

export interface AddDiseaseInput {
  diseaseCatalogId?: number
  name?: string
  isChronic?: boolean
  status?: DiseaseStatus
  dxDate?: string
  notes?: string
}

export interface UpdateDiseaseInput {
  status?: DiseaseStatus
  dxDate?: string
  notes?: string
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

// ─── Tratamiento actual (medicamentos en la consulta) ──────────────────────

export type MedicationAdherence = 'good' | 'partial' | 'poor'
export type MedicationRamStatus = 'none' | 'suspected' | 'confirmed'

export interface ConsultationMedication {
  id: number
  patientId: number
  medicationId: number
  consultationId: number | null
  status: 'current' | 'previous'
  dose: string | null
  frequency: string | null
  startAt: string | null
  endAt: string | null
  discontinuationReason: string | null
  adherence: MedicationAdherence | null
  adherenceNotes: string | null
  ramStatus: MedicationRamStatus | null
  ramNotes: string | null
  prescriberSpecialistId: number | null
  createdAt: string
  brandName: string | null
  genericName: string | null
  concentration: string | null
  presentationName: string | null
}

export interface AddMedicationInput {
  medicationId: number
  dose?: string
  frequency?: string
  startAt?: string
}

export interface CaptureMedicationInput {
  dose?: string
  frequency?: string
  adherence?: MedicationAdherence
  adherenceNotes?: string
  ramStatus?: MedicationRamStatus
  ramNotes?: string
  // Reemplazo por otro fármaco del catálogo.
  replacementMedicationId?: number
}

export interface MedicationHistoryItem {
  brandName: string | null
  genericName: string | null
  dose: string | null
  frequency: string | null
  adherence: MedicationAdherence | null
  ramStatus: MedicationRamStatus | null
  adherenceNotes: string | null
  ramNotes: string | null
  discontinuationReason: string | null
}
