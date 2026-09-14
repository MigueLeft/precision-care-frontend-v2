export type AntecedentType =
  | 'family'
  | 'personal'
  | 'surgery'
  | 'hospitalization'
  | 'other'

export type AntecedentStatus =
  | 'active'
  | 'in_follow_up'
  | 'resolved'
  | 'inactive'

export interface AntecedentSurgeryDetail {
  antecedentId: number
  procedure: string | null
  institution: string | null
  complications: string | null
  treatingPhysician: string | null
  procedureCatalogId: number | null
}

export interface AntecedentHospitalizationDetail {
  antecedentId: number
  admissionDate: string | null
  dischargeDate: string | null
  reason: string | null
  institution: string | null
  dischargeDiagnosisCie10: string | null
  reasonCatalogId: number | null
}

export interface Antecedent {
  id: number
  patientId: number
  type: AntecedentType
  cie10Code: string | null
  name: string
  description: string | null
  eventDate: string | null
  relationship: string | null
  status: AntecedentStatus | null
  familyCatalogId: number | null
  personalCatalogId: number | null
  surgeryDetail: AntecedentSurgeryDetail | null
  hospitalizationDetail: AntecedentHospitalizationDetail | null
  createdAt: string
  updatedAt: string
}

export interface CreateAntecedentPayload {
  patientId: number
  type: AntecedentType
  name: string
  cie10Code?: string
  description?: string
  eventDate?: string
  relationship?: string
  status?: AntecedentStatus
  familyCatalogId?: number
  personalCatalogId?: number
  surgeryDetail?: {
    procedure?: string
    institution?: string
    complications?: string
    treatingPhysician?: string
    procedureCatalogId?: number
  }
  hospitalizationDetail?: {
    admissionDate?: string
    dischargeDate?: string
    reason?: string
    institution?: string
    dischargeDiagnosisCie10?: string
    reasonCatalogId?: number
  }
}

export type UpdateAntecedentPayload = Partial<Omit<CreateAntecedentPayload, 'patientId'>>
