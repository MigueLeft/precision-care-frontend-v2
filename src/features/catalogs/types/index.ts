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
  shortCode: string
  cie10Chapter: string | null
  description: string | null
  sortOrder: number
  active: boolean
}

export interface Cie10Entry {
  code: string
  description: string
  chapter: string | null
  bodySystemId: number | null
  version: string
}

export interface Medication {
  id: number
  brandName: string
  genericName: string
  presentation: string
  concentration: string | null
  category: string | null
  active: boolean
}

export interface CreateMedicationPayload {
  brandName: string
  genericName: string
  presentation: string
  concentration?: string
  category?: string
}
export type UpdateMedicationPayload = Partial<CreateMedicationPayload>

export type ExamCategory = 'laboratory' | 'imaging' | 'cardiology' | 'other'
export type ExamValueType = 'numeric' | 'text' | 'boolean'

export interface ExamCatalog {
  id: number
  category: ExamCategory
  name: string
  defaultUnit: string | null
  referenceMin: string | null
  referenceMax: string | null
  valueType: ExamValueType
  active: boolean
}

export interface CreateExamPayload {
  name: string
  category: ExamCategory
  defaultUnit?: string
  valueType: ExamValueType
  referenceMin?: number
  referenceMax?: number
}
export type UpdateExamPayload = Partial<CreateExamPayload>

export interface SymptomCatalog {
  id: number
  name: string
  cie10Code: string | null
  bodySystemId: number | null
  active: boolean
}

export interface CreateSymptomPayload {
  name: string
  cie10Code?: string
  bodySystemId?: number
}
export type UpdateSymptomPayload = Partial<CreateSymptomPayload>
