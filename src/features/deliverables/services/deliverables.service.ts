import { api } from '@/utils/api'
import type { Deliverable } from '../types'

export async function fetchDeliverablesByPatient(
  patientId: number,
): Promise<Deliverable[]> {
  const { data } = await api.get<{ deliverables: Deliverable[] }>(
    `/deliverables/patient/${patientId}`,
  )
  return data.deliverables
}
