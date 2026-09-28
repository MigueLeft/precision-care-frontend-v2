import type {
  DiseaseStatus,
  MedicationAdherence,
  MedicationRamStatus,
  SymptomStatus,
} from './index'

// Nota evolutiva automática (GET /consultations/:id/evolution): solo lo que
// cambió respecto a la consulta anterior.

export type MedicationChangeKind = 'added' | 'discontinued' | 'resumed' | 'modified'

export type MedicationChangeField = 'dose' | 'frequency' | 'adherence' | 'ramStatus'

export interface MedicationEvolution {
  medicationId: number
  name: string | null
  change: MedicationChangeKind
  reason: string | null
  fields: {
    field: MedicationChangeField
    before: string | MedicationAdherence | MedicationRamStatus | null
    after: string | MedicationAdherence | MedicationRamStatus | null
  }[]
}

export interface DiseaseEvolution {
  diseaseCatalogId: number
  name: string | null
  code: string | null
  before: DiseaseStatus | null
  after: DiseaseStatus
  notes: string | null
}

export interface SymptomSnapshot {
  status: SymptomStatus
  severityName: string | null
}

export interface SymptomEvolution {
  symptomCatalogId: number
  name: string | null
  before: SymptomSnapshot | null
  after: SymptomSnapshot
}

// Valores numéricos por clave (GENERAL_PARAMS / PHYSICAL_EXAM_PARAMS).
export type NumericSnapshot = Record<string, number | null>

export interface MeasurementEvolution {
  before: NumericSnapshot | null
  after: NumericSnapshot
}

export interface ConsultationEvolution {
  previousConsultation: {
    id: number
    startAt: string
    specialistName: string | null
  } | null
  medications: MedicationEvolution[]
  diseases: DiseaseEvolution[]
  symptoms: SymptomEvolution[]
  bodyComposition: MeasurementEvolution | null
  physicalExam: MeasurementEvolution | null
}
