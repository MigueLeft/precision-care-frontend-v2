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
}

export async function fetchMe(): Promise<CurrentUser | null> {
  const { data } = await api.get<{ user: CurrentUser | null }>('/users/me')
  return data.user
}
