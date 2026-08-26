import { api } from '@/utils/api'
import type { Medication, CreateMedicationPayload, UpdateMedicationPayload } from '../types'

export async function fetchMedications(): Promise<Medication[]> {
  const { data } = await api.get<{ medications: Medication[] }>('/catalogs/medications')
  return data.medications
}

export async function createMedication(payload: CreateMedicationPayload): Promise<Medication> {
  const { data } = await api.post<{ medication: Medication }>('/catalogs/medications', payload)
  return data.medication
}

export async function updateMedication(
  id: number,
  payload: UpdateMedicationPayload,
): Promise<Medication> {
  const { data } = await api.patch<{ medication: Medication }>(`/catalogs/medications/${id}`, payload)
  return data.medication
}

export async function toggleMedicationActive(id: number): Promise<Medication> {
  const { data } = await api.patch<{ medication: Medication }>(
    `/catalogs/medications/${id}/toggle-active`,
  )
  return data.medication
}
