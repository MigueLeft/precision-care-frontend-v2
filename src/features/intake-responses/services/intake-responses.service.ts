import { api } from '@/utils/api'
import type { IntakeResponse, IntakeResponseDetail } from '../types'

export async function fetchIntakeResponsesByPatient(
  patientId: number,
): Promise<IntakeResponse[]> {
  const { data } = await api.get<{ responses: IntakeResponse[] }>(
    `/intake-responses/patient/${patientId}`,
  )
  return data.responses
}

export async function fetchIntakeResponseDetail(
  id: number,
): Promise<IntakeResponseDetail> {
  const { data } = await api.get<{ response: IntakeResponseDetail }>(
    `/intake-responses/${id}/detail`,
  )
  return data.response
}

export interface SendIntakeResult {
  response: IntakeResponse
  link: string
}

// Crea la respuesta y devuelve el link público para llenarla sin iniciar
// sesión. No se envía por correo — se copia/pega manualmente (WhatsApp, SMS, etc.).
export async function sendIntakeToPatient(
  patientId: number,
  intakeVersionId: number,
): Promise<SendIntakeResult> {
  const { data } = await api.post<SendIntakeResult>('/intake-responses/send', {
    patientId,
    intakeVersionId,
  })
  return data
}
