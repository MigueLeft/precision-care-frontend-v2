import { api } from '@/utils/api'
import type {
  CreateParaclinicalResultInput,
  ParaclinicalOrder,
  ParaclinicalResult,
} from '../types'

export async function fetchParaclinicalResultsByPatient(
  patientId: number,
): Promise<ParaclinicalResult[]> {
  const { data } = await api.get<{ paraclinicalResults: ParaclinicalResult[] }>(
    `/paraclinical-results/patient/${patientId}`,
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
