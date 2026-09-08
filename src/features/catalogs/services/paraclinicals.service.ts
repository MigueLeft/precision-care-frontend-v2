import { api } from '@/utils/api'
import type {
  ParaclinicalCatalog,
  CreateParaclinicalPayload,
  UpdateParaclinicalPayload,
} from '../types'

export async function fetchParaclinicals(): Promise<ParaclinicalCatalog[]> {
  const { data } = await api.get<{ paraclinicals: ParaclinicalCatalog[] }>(
    '/catalogs/paraclinicals',
  )
  return data.paraclinicals
}

export async function createParaclinical(
  payload: CreateParaclinicalPayload,
): Promise<ParaclinicalCatalog> {
  const { data } = await api.post<{ paraclinical: ParaclinicalCatalog }>(
    '/catalogs/paraclinicals',
    payload,
  )
  return data.paraclinical
}

export async function updateParaclinical(
  id: number,
  payload: UpdateParaclinicalPayload,
): Promise<ParaclinicalCatalog> {
  const { data } = await api.patch<{ paraclinical: ParaclinicalCatalog }>(
    `/catalogs/paraclinicals/${id}`,
    payload,
  )
  return data.paraclinical
}

export async function toggleParaclinicalActive(
  id: number,
): Promise<ParaclinicalCatalog> {
  const { data } = await api.patch<{ paraclinical: ParaclinicalCatalog }>(
    `/catalogs/paraclinicals/${id}/toggle-active`,
  )
  return data.paraclinical
}
