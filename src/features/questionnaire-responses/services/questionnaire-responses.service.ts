import { api } from '@/utils/api'
import type { QuestionnaireResponse } from '../types'

export async function fetchQuestionnaireResponsesByPatient(
  patientId: number,
): Promise<QuestionnaireResponse[]> {
  const { data } = await api.get<{ responses: QuestionnaireResponse[] }>(
    `/questionnaire-responses/patient/${patientId}`,
  )
  return data.responses
}
