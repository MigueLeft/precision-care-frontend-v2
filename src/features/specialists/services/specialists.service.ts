import { api } from '@/utils/api'
import type {
  Specialist,
  CreateSpecialistPayload,
  UpdateSpecialistPayload,
  CreateSpecialistResult,
  SpecialistUserInput,
} from '../types'

export async function fetchSpecialists(): Promise<Specialist[]> {
  const { data } = await api.get<{ specialists: Specialist[] }>('/specialists')
  return data.specialists
}

export async function fetchSpecialist(id: number): Promise<Specialist> {
  const { data } = await api.get<{ specialist: Specialist }>(`/specialists/${id}`)
  return data.specialist
}

export async function createSpecialist(
  payload: CreateSpecialistPayload,
): Promise<CreateSpecialistResult> {
  const { data } = await api.post<CreateSpecialistResult>('/specialists', payload)
  return data
}

export async function updateSpecialist(
  id: number,
  payload: UpdateSpecialistPayload,
): Promise<Specialist> {
  const { data } = await api.patch<{ specialist: Specialist }>(
    `/specialists/${id}`,
    payload,
  )
  return data.specialist
}

export async function setSpecialistStatus(
  id: number,
  active: boolean,
): Promise<Specialist> {
  const { data } = await api.patch<{ specialist: Specialist }>(
    `/specialists/${id}/status`,
    { active },
  )
  return data.specialist
}

export async function addSpecialistUser(
  id: number,
  payload: SpecialistUserInput,
): Promise<CreateSpecialistResult> {
  const { data } = await api.post<CreateSpecialistResult>(
    `/specialists/${id}/user`,
    payload,
  )
  return data
}

export async function resendSpecialistInvitation(
  id: number,
): Promise<{ sent: boolean }> {
  const { data } = await api.post<{ sent: boolean }>(
    `/specialists/${id}/user/resend-invitation`,
  )
  return data
}
