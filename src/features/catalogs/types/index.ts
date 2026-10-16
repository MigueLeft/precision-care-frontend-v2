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
  // Indicación predefinida del récipe (editable al recetar).
  defaultIndication: string | null
  active: boolean
}

export interface CreateMedicationPayload {
  brandName: string
  genericName: string
  presentationId: number
  concentration?: string
  categoryId?: number
  defaultIndication?: string | null
}
export type UpdateMedicationPayload = Partial<CreateMedicationPayload>

export type ParaclinicalValueType = 'numeric' | 'text' | 'boolean'

export interface ParaclinicalCatalog {
  id: number
  categoryId: number
  name: string
  loincCode: string | null
  description: string | null
  defaultUnit: string | null
  referenceMin: string | null
  referenceMax: string | null
  valueType: ParaclinicalValueType
  active: boolean
}

export interface CreateParaclinicalPayload {
  name: string
  categoryId: number
  // Vacío = sin código / sin descripción.
  loincCode?: string
  description?: string
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

export interface SymptomSeverity {
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
  // Nombre cotidiano: como suele conocer el paciente a la enfermedad (el del IM1).
  commonName: string | null
  code: string | null
  isChronic: boolean
  bodySystemId: number | null
  active: boolean
}

export interface CreateDiseasePayload {
  name: string
  commonName?: string | null
  code?: string
  isChronic: boolean
  bodySystemId?: number | null
}
export type UpdateDiseasePayload = Partial<CreateDiseasePayload>

export interface SurgeryCatalog {
  id: number
  name: string
  active: boolean
}

export interface HospitalizationCatalog {
  id: number
  name: string
  active: boolean
}

// Estudio dentro de un perfil de laboratorio (en el orden del perfil).
export interface LabProfileItem {
  id: number
  name: string
  loincCode: string | null
  defaultUnit: string | null
  active: boolean
}

// Perfil de laboratorio: grupo de estudios que se ordenan juntos.
export interface LabProfile {
  id: number
  name: string
  description: string | null
  active: boolean
  items: LabProfileItem[]
}

export interface CreateLabProfilePayload {
  name: string
  description?: string
  paraclinicalIds: number[]
}
export type UpdateLabProfilePayload = Partial<CreateLabProfilePayload>
