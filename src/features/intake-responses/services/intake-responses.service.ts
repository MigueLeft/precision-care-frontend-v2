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
