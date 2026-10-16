import { api } from '@/utils/api'
import { draftParams } from '@/utils/draft-params'
import type {
  CreateParaclinicalResultInput,
  ParaclinicalOrder,
  ParaclinicalResult,
} from '../types'

// Con consultationId incluye el borrador de esa consulta en curso.
export async function fetchParaclinicalResultsByPatient(
  patientId: number,
  consultationId?: number,
): Promise<ParaclinicalResult[]> {
  const { data } = await api.get<{ paraclinicalResults: ParaclinicalResult[] }>(
    `/paraclinical-results/patient/${patientId}`,
    draftParams(consultationId),
  )
  return data.paraclinicalResults
}

export async function fetchParaclinicalOrdersByPatient(
  patientId: number,
): Promise<ParaclinicalOrder[]> {
  const { data } = await api.get<{ paraclinicalOrders: ParaclinicalOrder[] }>(
    `/paraclinical-orders/patient/${patientId}`,
  )
  return data.paraclinicalOrders
}

export async function createParaclinicalResult(
  input: CreateParaclinicalResultInput,
): Promise<ParaclinicalResult> {
  const { data } = await api.post<{ paraclinicalResult: ParaclinicalResult }>(
    '/paraclinical-results',
    input,
  )
  return data.paraclinicalResult
}

export async function removeParaclinicalResult(id: number): Promise<void> {
  await api.delete(`/paraclinical-results/${id}`)
}

// Quita un solo estudio de un resultado (si era el único, se elimina el resultado).
// Desde una consulta en curso, uno ya confirmado se quita al finalizarla.
export async function removeParaclinicalValue(
  resultId: number,
  valueId: number,
  consultationId?: number,
): Promise<void> {
  await api.delete(
    `/paraclinical-results/${resultId}/values/${valueId}`,
    draftParams(consultationId),
  )
}
