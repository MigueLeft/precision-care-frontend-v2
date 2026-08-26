export interface Patient {
  id: number
  mrn: string
  firstName: string
  middleName: string | null
  lastName: string
  secondLastName: string | null
  birthDate: string
  email: string | null
  nationalityCountryId: number | null
  originCountryId: number | null
  residenceCountryId: number | null
  address: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  civilStatusId: number | null
  raceId: number | null
  socioeconomicLevelId: number | null
  createdAt: string
  createdBy: number
  updatedAt: string
  updatedBy: number
  deletedAt: string | null
  deletedBy: number | null
}

export type AllergyType = 'food' | 'medication' | 'environmental' | 'other'
export type AllergySeverity = 'mild' | 'moderate' | 'severe'

export interface Allergy {
  id: number
  patientId: number
  type: AllergyType
  medicationId: number | null
  description: string
  severity: AllergySeverity | null
  createdAt: string
  createdBy: number
  updatedAt: string
  updatedBy: number
  deletedAt: string | null
  deletedBy: number | null
}
