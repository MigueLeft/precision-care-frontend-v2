// Debe coincidir con la forma enriquecida que devuelve SpecialistsService.list()
// en el backend (precision-care-backend-v2).

export interface SpecialistSpecialtyRef {
  id: number
  name: string
}

export interface Specialist {
  id: number
  name: string
  lastName: string
  email: string
  phone: string | null
  active: boolean
  practiceAddress: string | null
  createdAt: string
  nationalityCountryId: number | null
  nationalityCountryName: string | null
  nationalityName: string | null
  residenceCountryId: number | null
  residenceCountryName: string | null
  stateId: number | null
  stateName: string | null
  cityId: number | null
  cityName: string | null
  primarySpecialtyId: number | null
  primarySpecialtyName: string | null
  otherSpecialties: SpecialistSpecialtyRef[]
  hasUser: boolean
  userId: number | null
  userActive: boolean | null
  roleName: string | null
  lastLoginAt: string | null
  patientsCount: number
  consultationsThisMonth: number
}

export type SpecialistPasswordMode = 'invite' | 'temporary'
export type SpecialistInitialStatus = 'active' | 'inactive'

export interface SpecialistUserInput {
  roleId: number
  initialStatus: SpecialistInitialStatus
  passwordMode: SpecialistPasswordMode
}

export interface CreateSpecialistPayload {
  name: string
  lastName: string
  email: string
  phone?: string
  nationalityCountryId: number
  residenceCountryId: number
  stateId?: number
  cityId?: number
  primarySpecialtyId: number
  otherSpecialtyIds?: number[]
  practiceAddress?: string
  active?: boolean
  user?: SpecialistUserInput
}

export type UpdateSpecialistPayload = Partial<
  Omit<CreateSpecialistPayload, 'user'>
>

export interface CreateSpecialistResult {
  specialist: Specialist
  temporaryPassword?: string
}
