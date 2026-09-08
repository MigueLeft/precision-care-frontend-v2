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
}

export interface AntecedentHospitalizationDetail {
  antecedentId: number
  admissionDate: string | null
  dischargeDate: string | null
  reason: string | null
  institution: string | null
  dischargeDiagnosisCie10: string | null
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
  surgeryDetail?: {
    procedure?: string
    institution?: string
    complications?: string
    treatingPhysician?: string
  }
  hospitalizationDetail?: {
    admissionDate?: string
    dischargeDate?: string
    reason?: string
    institution?: string
    dischargeDiagnosisCie10?: string
  }
}

export type UpdateAntecedentPayload = Partial<Omit<CreateAntecedentPayload, 'patientId'>>
