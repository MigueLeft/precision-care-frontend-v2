import { api } from '@/utils/api'
import { draftParams } from '@/utils/draft-params'
import type { Anthropometry, SaveAnthropometryInput } from '../types'

// Con consultationId incluye el borrador de esa consulta en curso.
export async function fetchAnthropometriesByPatient(
  patientId: number,
  consultationId?: number,
): Promise<Anthropometry[]> {
  const { data } = await api.get<{ anthropometries: Anthropometry[] }>(
    `/anthropometry/patient/${patientId}`,
    draftParams(consultationId),
  )
  return data.anthropometries
}

export async function fetchAnthropometryByConsultation(
  consultationId: number,
): Promise<Anthropometry | null> {
  const { data } = await api.get<{ anthropometry: Anthropometry | null }>(
    `/anthropometry/consultation/${consultationId}`,
  )
  return data.anthropometry
}

export async function fetchAnthropometryByAppointment(
  appointmentId: number,
): Promise<Anthropometry | null> {
  const { data } = await api.get<{ anthropometry: Anthropometry | null }>(
    `/anthropometry/appointment/${appointmentId}`,
  )
  return data.anthropometry
}

export async function createAnthropometry(input: SaveAnthropometryInput): Promise<Anthropometry> {
  const { data } = await api.post<{ anthropometry: Anthropometry }>('/anthropometry', input)
  return data.anthropometry
}

export async function updateAnthropometry(
  id: number,
  input: Omit<SaveAnthropometryInput, 'patientId' | 'consultationId'>,
): Promise<Anthropometry> {
  const { data } = await api.patch<{ anthropometry: Anthropometry }>(`/anthropometry/${id}`, input)
  return data.anthropometry
}
