import { api } from '@/utils/api'
import type { BodyComposition, SaveBodyCompositionInput } from '../types'

export async function fetchBodyCompositionsByPatient(
  patientId: number,
): Promise<BodyComposition[]> {
  const { data } = await api.get<{ bodyCompositions: BodyComposition[] }>(
    `/body-compositions/patient/${patientId}`,
  )
  return data.bodyCompositions
}

export async function fetchBodyCompositionByConsultation(
  consultationId: number,
): Promise<BodyComposition | null> {
  const { data } = await api.get<{ bodyComposition: BodyComposition | null }>(
    `/body-compositions/consultation/${consultationId}`,
  )
  return data.bodyComposition
}

export async function createBodyComposition(
  input: SaveBodyCompositionInput,
): Promise<BodyComposition> {
  const { data } = await api.post<{ bodyComposition: BodyComposition }>(
    '/body-compositions',
    input,
  )
  return data.bodyComposition
}

export async function updateBodyComposition(
  id: number,
  input: Omit<SaveBodyCompositionInput, 'patientId' | 'consultationId'>,
): Promise<BodyComposition> {
  const { data } = await api.patch<{ bodyComposition: BodyComposition }>(
    `/body-compositions/${id}`,
    input,
  )
  return data.bodyComposition
}
