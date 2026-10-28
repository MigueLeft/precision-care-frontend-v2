import { api } from '@/utils/api'
import type {
  CreateStudyOrderPayload,
  PrintDeliverableResult,
  StudyOrder,
  StudyOrderContentPayload,
} from '../types'

export async function fetchConsultationStudyOrders(consultationId: number): Promise<StudyOrder[]> {
  const { data } = await api.get<{ studyOrders: StudyOrder[] }>(`/study-orders/consultation/${consultationId}`)
  return data.studyOrders
}

export async function fetchStudyOrder(id: number): Promise<StudyOrder> {
  const { data } = await api.get<{ studyOrder: StudyOrder }>(`/study-orders/${id}`)
  return data.studyOrder
}

export async function createStudyOrder(payload: CreateStudyOrderPayload): Promise<StudyOrder> {
  const { data } = await api.post<{ studyOrder: StudyOrder }>('/study-orders', payload)
  return data.studyOrder
}

export async function updateStudyOrder(id: number, payload: StudyOrderContentPayload): Promise<StudyOrder> {
  const { data } = await api.put<{ studyOrder: StudyOrder }>(`/study-orders/${id}`, payload)
  return data.studyOrder
}

export async function deleteStudyOrder(id: number): Promise<void> {
  await api.delete(`/study-orders/${id}`)
}

export async function printStudyOrder(id: number): Promise<PrintDeliverableResult> {
  const { data } = await api.post<PrintDeliverableResult>(`/study-orders/${id}/print`)
  return data
}
