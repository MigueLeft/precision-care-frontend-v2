import { api } from '@/utils/api'
import type { UserAccount, CreateUserPayload, UpdateUserPayload } from '../types'

export async function fetchUsers(includeDeleted = false): Promise<UserAccount[]> {
  const { data } = await api.get<{ users: UserAccount[] }>('/users', {
    params: includeDeleted ? { includeDeleted: 'true' } : undefined,
  })
  return data.users
}

export async function fetchUser(id: number): Promise<UserAccount> {
  const { data } = await api.get<{ user: UserAccount }>(`/users/${id}`)
  return data.user
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const { data } = await api.get<{ exists: boolean }>('/users/email-exists', { params: { email } })
  return data.exists
}

export async function createUser(payload: CreateUserPayload): Promise<UserAccount> {
  const { data } = await api.post<{ user: UserAccount }>('/users', payload)
  return data.user
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<UserAccount> {
  const { data } = await api.patch<{ user: UserAccount }>(`/users/${id}`, payload)
  return data.user
}

export async function deleteUser(id: number): Promise<UserAccount> {
  const { data } = await api.delete<{ user: UserAccount }>(`/users/${id}`)
  return data.user
}

export async function restoreUser(id: number): Promise<UserAccount> {
  const { data } = await api.post<{ user: UserAccount }>(`/users/${id}/restore`)
  return data.user
}

export async function assignUserRole(userId: number, roleId: number): Promise<UserAccount> {
  const { data } = await api.post<{ user: UserAccount }>(`/users/${userId}/role`, { roleId })
  return data.user
}
