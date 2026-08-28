export type PermissionAction = 'create' | 'read' | 'update' | 'delete'

export interface Permission {
  id: number
  code: string
  module: string
  action: PermissionAction
  description: string | null
}

export interface Role {
  id: number
  name: string
  description: string | null
  active: boolean
  userCount: number
  permissions: Permission[]
}

export interface CreateRolePayload {
  name: string
  description?: string
}
export type UpdateRolePayload = Partial<CreateRolePayload> & { active?: boolean }

export type UserType = 'patient' | 'specialist' | 'administrative'

export interface UserAccount {
  id: number
  email: string
  name: string
  lastName: string
  type: UserType
  active: boolean
  patientId: number | null
  specialistId: number | null
  lastLoginAt: string | null
  roleId: number | null
  roleName: string | null
  deletedAt: string | null
}

export interface CreateUserPayload {
  email: string
  password: string
  name: string
  lastName: string
  type: UserType
  patientId?: number
  specialistId?: number
}

export interface UpdateUserPayload {
  name?: string
  lastName?: string
  active?: boolean
  patientId?: number
  specialistId?: number
}

export interface SpecialistLookup {
  id: number
  name: string
  lastName: string
}
