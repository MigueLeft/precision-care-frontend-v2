import { api } from '@/utils/api'
import type {
  Antecedent,
  CreateAntecedentPayload,
  UpdateAntecedentPayload,
} from '../types'

export async function fetchAntecedentsByPatient(
  patientId: number,
): Promise<Antecedent[]> {
  const { data } = await api.get<{ antecedents: Antecedent[] }>(
    `/patients/${patientId}/antecedents`,
  )
  return data.antecedents
}

export async function createAntecedent(
  payload: CreateAntecedentPayload,
): Promise<Antecedent> {
  const { data } = await api.post<{ antecedent: Antecedent }>(
    '/antecedents',
    payload,
  )
  return data.antecedent
}

export async function updateAntecedent(
  id: number,
  payload: UpdateAntecedentPayload,
): Promise<Antecedent> {
  const { data } = await api.patch<{ antecedent: Antecedent }>(
    `/antecedents/${id}`,
    payload,
  )
  return data.antecedent
}

export async function deleteAntecedent(id: number): Promise<Antecedent> {
  const { data } = await api.delete<{ antecedent: Antecedent }>(
    `/antecedents/${id}`,
  )
  return data.antecedent
}
