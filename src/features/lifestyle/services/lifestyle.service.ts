import { api } from '@/utils/api'
import type { LifestyleAssessment } from '../types'

export async function fetchLifestyleByPatient(
  patientId: number,
): Promise<LifestyleAssessment[]> {
  const { data } = await api.get<{ evaluations: LifestyleAssessment[] }>(
    `/lifestyle/patient/${patientId}`,
  )
  return data.evaluations
}
