import { api } from '@/utils/api'
import type {
  Questionnaire,
  QuestionnaireDetailed,
  QuestionnaireVersion,
  CreateQuestionnairePayload,
  UpdateQuestionnairePayload,
} from '../types'

export async function fetchQuestionnaires(): Promise<Questionnaire[]> {
  const { data } = await api.get<{ questionnaires: Questionnaire[] }>('/questionnaires')
  return data.questionnaires
}

export async function fetchQuestionnaireDetailed(id: number): Promise<QuestionnaireDetailed> {
  const { data } = await api.get<{ questionnaire: QuestionnaireDetailed }>(
    `/questionnaires/${id}/detailed`,
  )
  return data.questionnaire
}

export async function createQuestionnaire(
  payload: CreateQuestionnairePayload,
): Promise<Questionnaire> {
  const { data } = await api.post<{ questionnaire: Questionnaire }>('/questionnaires', payload)
  return data.questionnaire
}

export async function updateQuestionnaire(
  id: number,
  payload: UpdateQuestionnairePayload,
): Promise<Questionnaire> {
  const { data } = await api.patch<{ questionnaire: Questionnaire }>(
    `/questionnaires/${id}`,
    payload,
  )
  return data.questionnaire
}

export async function deleteQuestionnaire(id: number): Promise<Questionnaire> {
  const { data } = await api.delete<{ questionnaire: Questionnaire }>(`/questionnaires/${id}`)
  return data.questionnaire
}

export async function getEditableVersion(questionnaireId: number): Promise<QuestionnaireVersion> {
  const { data } = await api.post<{ version: QuestionnaireVersion }>(
    `/questionnaires/${questionnaireId}/versions/editable`,
  )
  return data.version
}

export async function publishVersion(versionId: number): Promise<QuestionnaireVersion> {
  const { data } = await api.post<{ version: QuestionnaireVersion }>(
    `/questionnaires/versions/${versionId}/publish`,
  )
  return data.version
}
