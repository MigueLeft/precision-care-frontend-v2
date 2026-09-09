export interface Country {
  id: number
  name: string
  nationalityName: string | null
}

export interface State {
  id: number
  name: string
  countryId: number
  active: boolean
}

export interface City {
  id: number
  name: string
  stateId: number
  active: boolean
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

export interface ParaclinicalCategoryCatalog {
  id: number
  name: string
  parentId: number | null
  active: boolean
}

export interface CreateParaclinicalCategoryPayload {
  name: string
  parentId?: number | null
}
export type UpdateParaclinicalCategoryPayload =
  Partial<CreateParaclinicalCategoryPayload>

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

export type ParaclinicalValueType = 'numeric' | 'text' | 'boolean'

export interface ParaclinicalCatalog {
  id: number
  categoryId: number
  name: string
  defaultUnit: string | null
  referenceMin: string | null
  referenceMax: string | null
  valueType: ParaclinicalValueType
  active: boolean
}

export interface CreateParaclinicalPayload {
  name: string
  categoryId: number
  defaultUnit?: string
  valueType: ParaclinicalValueType
  referenceMin?: number
  referenceMax?: number
}
export type UpdateParaclinicalPayload = Partial<CreateParaclinicalPayload>

export interface SymptomCatalog {
  id: number
  name: string
  active: boolean
}

export interface CreateSymptomPayload {
  name: string
}
export type UpdateSymptomPayload = Partial<CreateSymptomPayload>

export interface AllergyType {
  id: number
  name: string
  active: boolean
}

export interface AllergySeverity {
  id: number
  name: string
  active: boolean
}

export interface AllergyCatalog {
  id: number
  name: string
  typeId: number
  active: boolean
}

export interface CreateAllergyCatalogPayload {
  name: string
  typeId: number
}
export type UpdateAllergyCatalogPayload = Partial<CreateAllergyCatalogPayload>

export interface Disease {
  id: number
  name: string
  code: string | null
  isChronic: boolean
  active: boolean
}

export interface CreateDiseasePayload {
  name: string
  code?: string
  isChronic: boolean
}
export type UpdateDiseasePayload = Partial<CreateDiseasePayload>
