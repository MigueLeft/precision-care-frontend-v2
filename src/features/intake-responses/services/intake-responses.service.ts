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
  // true si además se envió por correo (SMTP de Brevo).
  sent: boolean
}

// Crea la respuesta y devuelve el link público para llenarla sin iniciar
// sesión; si el paciente tiene correo, el backend también se lo envía.
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

// Reenvía por correo el enlace de un formulario pendiente.
export async function sendIntakeEmail(
  responseId: number,
): Promise<{ sent: boolean; email: string }> {
  const { data } = await api.post<{ sent: boolean; email: string }>(
    `/intake-responses/${responseId}/send-email`,
  )
  return data
}
