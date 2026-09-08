import { api } from '@/utils/api'
import type { PhysicalExam } from '../types'

export async function fetchPhysicalExamsByPatient(
  patientId: number,
): Promise<PhysicalExam[]> {
  const { data } = await api.get<{ physicalExams: PhysicalExam[] }>(
    `/physical-exams/patient/${patientId}`,
  )
  return data.physicalExams
}
