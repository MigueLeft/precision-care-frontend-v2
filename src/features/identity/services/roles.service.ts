import { api } from '@/utils/api'
import type { Role, CreateRolePayload, UpdateRolePayload } from '../types'

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await api.get<{ roles: Role[] }>('/roles')
  return data.roles
}

export async function fetchRole(id: number): Promise<Role> {
  const { data } = await api.get<{ role: Role }>(`/roles/${id}`)
  return data.role
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const { data } = await api.post<{ role: Role }>('/roles', payload)
  return data.role
}

export async function updateRole(id: number, payload: UpdateRolePayload): Promise<Role> {
  const { data } = await api.patch<{ role: Role }>(`/roles/${id}`, payload)
  return data.role
}

export async function deleteRole(id: number): Promise<Role> {
  const { data } = await api.delete<{ role: Role }>(`/roles/${id}`)
  return data.role
}

export async function setRolePermissions(id: number, permissionIds: number[]): Promise<Role> {
  const { data } = await api.put<{ role: Role }>(`/roles/${id}/permissions`, { permissionIds })
  return data.role
}
