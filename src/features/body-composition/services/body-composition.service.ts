import { api } from '@/utils/api'
import type { BodyComposition } from '../types'

export async function fetchBodyCompositionsByPatient(
  patientId: number,
): Promise<BodyComposition[]> {
  const { data } = await api.get<{ bodyCompositions: BodyComposition[] }>(
    `/body-compositions/patient/${patientId}`,
  )
  return data.bodyCompositions
}
