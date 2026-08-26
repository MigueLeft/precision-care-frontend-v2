import { api } from '@/utils/api'
import type { SymptomCatalog, CreateSymptomPayload, UpdateSymptomPayload } from '../types'

export async function fetchSymptoms(): Promise<SymptomCatalog[]> {
  const { data } = await api.get<{ symptoms: SymptomCatalog[] }>('/catalogs/symptoms')
  return data.symptoms
}

export async function createSymptom(payload: CreateSymptomPayload): Promise<SymptomCatalog> {
  const { data } = await api.post<{ symptom: SymptomCatalog }>('/catalogs/symptoms', payload)
  return data.symptom
}

export async function updateSymptom(
  id: number,
  payload: UpdateSymptomPayload,
): Promise<SymptomCatalog> {
  const { data } = await api.patch<{ symptom: SymptomCatalog }>(`/catalogs/symptoms/${id}`, payload)
  return data.symptom
}

export async function toggleSymptomActive(id: number): Promise<SymptomCatalog> {
  const { data } = await api.patch<{ symptom: SymptomCatalog }>(
    `/catalogs/symptoms/${id}/toggle-active`,
  )
  return data.symptom
}
