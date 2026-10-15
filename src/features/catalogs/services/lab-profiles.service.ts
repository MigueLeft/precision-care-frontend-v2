import { api } from '@/utils/api'
import type { CreateLabProfilePayload, LabProfile, UpdateLabProfilePayload } from '../types'

export async function fetchLabProfiles(): Promise<LabProfile[]> {
  const { data } = await api.get<{ labProfiles: LabProfile[] }>('/catalogs/lab-profiles')
  return data.labProfiles
}

export async function createLabProfile(payload: CreateLabProfilePayload): Promise<LabProfile> {
  const { data } = await api.post<{ labProfile: LabProfile }>('/catalogs/lab-profiles', payload)
  return data.labProfile
}

export async function updateLabProfile(
  id: number,
  payload: UpdateLabProfilePayload,
): Promise<LabProfile> {
  const { data } = await api.patch<{ labProfile: LabProfile }>(
    `/catalogs/lab-profiles/${id}`,
    payload,
  )
  return data.labProfile
}

export async function toggleLabProfileActive(id: number): Promise<LabProfile> {
  const { data } = await api.patch<{ labProfile: LabProfile }>(
    `/catalogs/lab-profiles/${id}/toggle-active`,
  )
  return data.labProfile
}
