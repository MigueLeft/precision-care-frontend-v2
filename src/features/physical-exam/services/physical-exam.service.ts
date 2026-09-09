import { api } from '@/utils/api'
import type {
  PhysicalExam,
  PhysicalExamMeasurements,
  SavePhysicalExamInput,
} from '../types'

export async function fetchPhysicalExamsByPatient(
  patientId: number,
): Promise<PhysicalExam[]> {
  const { data } = await api.get<{ physicalExams: PhysicalExam[] }>(
    `/physical-exams/patient/${patientId}`,
  )
  return data.physicalExams
}

export async function fetchPhysicalExamByConsultation(
  consultationId: number,
): Promise<PhysicalExam | null> {
  const { data } = await api.get<{ physicalExams: PhysicalExam[] }>(
    `/physical-exams/consultation/${consultationId}`,
  )
  return data.physicalExams[0] ?? null
}

export async function createPhysicalExam(
  input: SavePhysicalExamInput,
): Promise<PhysicalExam> {
  const { data } = await api.post<{ physicalExam: PhysicalExam }>(
    '/physical-exams',
    input,
  )
  return data.physicalExam
}

export async function updatePhysicalExam(
  id: number,
  measurements: PhysicalExamMeasurements,
): Promise<PhysicalExam> {
  const { data } = await api.patch<{ physicalExam: PhysicalExam }>(
    `/physical-exams/${id}`,
    { measurements },
  )
  return data.physicalExam
}
