export interface Patient {
  id: number
  mrn: string
  firstName: string
  middleName: string | null
  lastName: string
  secondLastName: string | null
  // Cédula u otro documento de identidad.
  identityDocument: string | null
  birthDate: string
  // Sexo biológico (define la silueta y las referencias de los reportes).
  sex: 'male' | 'female' | null
  email: string | null
  // Formato internacional E.164 (+584121234567).
  phone: string | null
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

// Historia clínica traída de la plataforma anterior (solo lectura).
export interface LegacySymptom {
  name: string
  category: string | null
  severity: string | null
  frequency: string | null
  duration: string | null
  notes: string | null
  reportedAt: string | null
}

export interface PatientLegacyHistory {
  id: number
  patientId: number
  source: string
  currentIllness: string | null
  diagnosticPlan: string | null
  treatmentPlan: string | null
  evolution: string | null
  problems: { actuales: string[]; previos: string[] } | null
  symptoms: LegacySymptom[] | null
  recordedAt: string | null
  importedAt: string
}
