import { api } from '@/utils/api'
import type { UserType } from '../types'

export interface CurrentUser {
  id: number
  email: string
  name: string
  lastName: string
  type: UserType
  specialistId: number | null
  active: boolean
  // Códigos de permiso de sus roles (ej. "citas_todas:read").
  permissions: string[]
}

export async function fetchMe(): Promise<CurrentUser | null> {
  const { data } = await api.get<{ user: CurrentUser | null }>('/users/me')
  // Un backend anterior no envía permisos: se asume ninguno.
  return data.user ? { ...data.user, permissions: data.user.permissions ?? [] } : null
}
