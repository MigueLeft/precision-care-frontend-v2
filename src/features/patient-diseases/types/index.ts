import type { DiseaseStatus } from '@/features/consultations'

export type { DiseaseStatus }

export interface PatientDisease {
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
  recordedAt: string
  specialistName: string | null
}

export interface AddPatientDiseaseInput {
  diseaseCatalogId?: number
  name?: string
  isChronic?: boolean
  code?: string
  bodySystemId: number
  status?: DiseaseStatus
  dxDate?: string
  notes?: string
}

export interface UpdatePatientDiseaseInput {
  status?: DiseaseStatus
  bodySystemId?: number
  dxDate?: string
  notes?: string
}
