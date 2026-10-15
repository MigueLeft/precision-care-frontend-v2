import { api } from '@/utils/api'
import type {
  ConsultationDeliverableType,
  ConsultationDrafts,
  Deliverable,
  LabOrderDraft,
  PrintDeliverableResult,
  SaveLabOrderPayload,
  SavePrescriptionPayload,
} from '../types'

export async function fetchDeliverablesByPatient(
  patientId: number,
): Promise<Deliverable[]> {
  const { data } = await api.get<{ deliverables: Deliverable[] }>(
    `/deliverables/patient/${patientId}`,
  )
  return data.deliverables
}

const consultationPath = (consultationId: number) => `/deliverables/consultation/${consultationId}`

export async function fetchConsultationDrafts(consultationId: number): Promise<ConsultationDrafts> {
  const { data } = await api.get<ConsultationDrafts>(`${consultationPath(consultationId)}/drafts`)
  return data
}

export async function saveLabOrder(
  consultationId: number,
  payload: SaveLabOrderPayload,
): Promise<LabOrderDraft> {
  const { data } = await api.put<{ labOrder: LabOrderDraft }>(
    `${consultationPath(consultationId)}/lab-order`,
    payload,
  )
  return data.labOrder
}

export async function savePrescription(
  consultationId: number,
  payload: SavePrescriptionPayload,
): Promise<ConsultationDrafts['prescription']> {
  const { data } = await api.put<{ prescription: ConsultationDrafts['prescription'] }>(
    `${consultationPath(consultationId)}/prescription`,
    payload,
  )
  return data.prescription
}

export async function printConsultationDeliverable(
  consultationId: number,
  type: ConsultationDeliverableType,
): Promise<PrintDeliverableResult> {
  const { data } = await api.post<PrintDeliverableResult>(
    `${consultationPath(consultationId)}/print`,
    { type },
  )
  return data
}
