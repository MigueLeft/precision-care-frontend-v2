import { api } from '@/utils/api'
import { draftParams } from '@/utils/draft-params'
import type {
  Antecedent,
  CreateAntecedentPayload,
  UpdateAntecedentPayload,
} from '../types'

// Con consultationId incluye el borrador de esa consulta en curso.
export async function fetchAntecedentsByPatient(
  patientId: number,
  consultationId?: number,
): Promise<Antecedent[]> {
  const { data } = await api.get<{ antecedents: Antecedent[] }>(
    `/patients/${patientId}/antecedents`,
    draftParams(consultationId),
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

export async function deleteAntecedent(
  id: number,
  consultationId?: number,
): Promise<Antecedent> {
  const { data } = await api.delete<{ antecedent: Antecedent }>(
    `/antecedents/${id}`,
    draftParams(consultationId),
  )
  return data.antecedent
}
