import { api } from '@/utils/api'
import type { ExamCatalog, CreateExamPayload, UpdateExamPayload } from '../types'

export async function fetchExams(): Promise<ExamCatalog[]> {
  const { data } = await api.get<{ exams: ExamCatalog[] }>('/catalogs/exams')
  return data.exams
}

export async function createExam(payload: CreateExamPayload): Promise<ExamCatalog> {
  const { data } = await api.post<{ exam: ExamCatalog }>('/catalogs/exams', payload)
  return data.exam
}

export async function updateExam(id: number, payload: UpdateExamPayload): Promise<ExamCatalog> {
  const { data } = await api.patch<{ exam: ExamCatalog }>(`/catalogs/exams/${id}`, payload)
  return data.exam
}

export async function toggleExamActive(id: number): Promise<ExamCatalog> {
  const { data } = await api.patch<{ exam: ExamCatalog }>(`/catalogs/exams/${id}/toggle-active`)
  return data.exam
}
