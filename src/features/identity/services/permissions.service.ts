import { api } from '@/utils/api'
import type { Permission } from '../types'

export async function fetchPermissions(): Promise<Permission[]> {
  const { data } = await api.get<{ permissions: Permission[] }>('/permissions')
  return data.permissions
}
