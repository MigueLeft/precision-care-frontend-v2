import { api } from '@/utils/api'
import type { UserAccount, CreateUserPayload, UpdateUserPayload } from '../types'

export async function fetchUsers(): Promise<UserAccount[]> {
  const { data } = await api.get<{ users: UserAccount[] }>('/users')
  return data.users
}

export async function fetchUser(id: number): Promise<UserAccount> {
  const { data } = await api.get<{ user: UserAccount }>(`/users/${id}`)
  return data.user
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

export async function assignUserRole(userId: number, roleId: number): Promise<UserAccount> {
  const { data } = await api.post<{ user: UserAccount }>(`/users/${userId}/role`, { roleId })
  return data.user
}
