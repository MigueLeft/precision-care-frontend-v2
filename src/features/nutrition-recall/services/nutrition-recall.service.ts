import { api } from '@/utils/api'
import type {
  NutritionRecall,
  NutritionRecallDetail,
  NutritionRecallReportStatus,
  ReportDeliveryInput,
  SendNutritionRecallDto,
  SendNutritionRecallResult,
} from '../types'

export async function fetchNutritionRecallsByPatient(
  patientId: number,
): Promise<NutritionRecall[]> {
  const { data } = await api.get<{ recalls: NutritionRecall[] }>(
    `/nutrition-recalls/patient/${patientId}`,
  )
  return data.recalls
}

export async function fetchNutritionRecallDetail(id: number): Promise<NutritionRecallDetail> {
  const { data } = await api.get<{ recall: NutritionRecallDetail }>(`/nutrition-recalls/${id}`)
  return data.recall
}

export async function sendNutritionRecall(
  payload: SendNutritionRecallDto,
): Promise<SendNutritionRecallResult> {
  const { data } = await api.post<SendNutritionRecallResult>('/nutrition-recalls/send', payload)
  return data
}

export async function sendNutritionRecallEmail(
  id: number,
): Promise<{ sent: boolean; email: string }> {
  const { data } = await api.post<{ sent: boolean; email: string }>(
    `/nutrition-recalls/${id}/send-email`,
  )
  return data
}

// Genera el reporte desde la transcripción y envía el PDF. Puede tardar varios
// minutos (el modelo calcula todo el reporte).
export async function generateNutritionRecallReport({
  id,
  sendToPatient,
}: ReportDeliveryInput): Promise<{ reportStatus: NutritionRecallReportStatus }> {
  const { data } = await api.post<{ reportStatus: NutritionRecallReportStatus }>(
    `/nutrition-recalls/${id}/generate-report`,
    { sendToPatient },
  )
  return data
}

export async function resendNutritionRecallReport({
  id,
  sendToPatient,
}: ReportDeliveryInput): Promise<{ reportStatus: NutritionRecallReportStatus }> {
  const { data } = await api.post<{ reportStatus: NutritionRecallReportStatus }>(
    `/nutrition-recalls/${id}/resend-report`,
    { sendToPatient },
  )
  return data
}
