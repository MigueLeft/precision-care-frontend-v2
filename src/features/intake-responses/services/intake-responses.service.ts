import { api } from '@/utils/api'
import type { IntakeResponse } from '../types'

export async function fetchIntakeResponsesByPatient(
  patientId: number,
): Promise<IntakeResponse[]> {
  const { data } = await api.get<{ responses: IntakeResponse[] }>(
    `/intake-responses/patient/${patientId}`,
  )
  return data.responses
}
