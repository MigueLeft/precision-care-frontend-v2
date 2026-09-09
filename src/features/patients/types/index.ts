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

// Alergia del paciente, resuelta con los nombres del catálogo por el backend.
export interface Allergy {
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
