export interface Country {
  id: number
  name: string
  isoCode: string
}

export interface CivilStatus {
  id: number
  name: string
  active: boolean
}

export interface Race {
  id: number
  name: string
  active: boolean
}

export interface SocioeconomicLevel {
  id: number
  name: string
  active: boolean
}

export interface Language {
  id: number
  name: string
  isoCode: string
  active: boolean
}

export interface BodySystem {
  id: number
  name: string
  active: boolean
}

export interface ExamCategoryCatalog {
  id: number
  name: string
  active: boolean
}

export interface MedicationPresentation {
  id: number
  name: string
  active: boolean
}

export interface MedicationCategory {
  id: number
  name: string
  active: boolean
}

export interface MedicalSpecialty {
  id: number
  name: string
  active: boolean
}

export interface Medication {
  id: number
  brandName: string
  genericName: string
  presentationId: number
  concentration: string | null
  categoryId: number | null
  active: boolean
}

export interface CreateMedicationPayload {
  brandName: string
  genericName: string
  presentationId: number
  concentration?: string
  categoryId?: number
}
export type UpdateMedicationPayload = Partial<CreateMedicationPayload>

export type ExamValueType = 'numeric' | 'text' | 'boolean'

export interface ExamCatalog {
  id: number
  categoryId: number
  name: string
  defaultUnit: string | null
  referenceMin: string | null
  referenceMax: string | null
  valueType: ExamValueType
  active: boolean
}

export interface CreateExamPayload {
  name: string
  categoryId: number
  defaultUnit?: string
  valueType: ExamValueType
  referenceMin?: number
  referenceMax?: number
}
export type UpdateExamPayload = Partial<CreateExamPayload>

export interface SymptomCatalog {
  id: number
  name: string
  active: boolean
}

export interface CreateSymptomPayload {
  name: string
}
export type UpdateSymptomPayload = Partial<CreateSymptomPayload>
