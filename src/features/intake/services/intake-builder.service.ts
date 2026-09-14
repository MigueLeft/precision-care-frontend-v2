import { api } from '@/utils/api'
import type {
  QuestionGroup,
  Question,
  QuestionOption,
  IntakeMapping,
  RangeInterpretation,
  CreateSectionPayload,
  UpdateSectionPayload,
  CreateQuestionPayload,
  UpdateQuestionPayload,
  CreateOptionPayload,
  UpdateOptionPayload,
  CreateMappingPayload,
  UpdateMappingPayload,
  CreateRangeInterpretationPayload,
  UpdateRangeInterpretationPayload,
} from '../types'

// ─── Secciones ──────────────────────────────────────────────────────────────

export async function createSection(
  versionId: number,
  payload: CreateSectionPayload,
): Promise<QuestionGroup> {
  const { data } = await api.post<{ group: QuestionGroup }>(
    `/intakes/versions/${versionId}/groups`,
    payload,
  )
  return data.group
}

export async function updateSection(
  groupId: number,
  payload: UpdateSectionPayload,
): Promise<QuestionGroup> {
  const { data } = await api.patch<{ group: QuestionGroup }>(`/intakes/groups/${groupId}`, payload)
  return data.group
}

export async function deleteSection(groupId: number): Promise<void> {
  await api.delete(`/intakes/groups/${groupId}`)
}

// ─── Preguntas ──────────────────────────────────────────────────────────────

export async function createQuestion(
  versionId: number,
  payload: CreateQuestionPayload,
): Promise<Question> {
  const { data } = await api.post<{ question: Question }>(
    `/intakes/versions/${versionId}/questions`,
    payload,
  )
  return data.question
}

export async function updateQuestion(
  questionId: number,
  payload: UpdateQuestionPayload,
): Promise<Question> {
  const { data } = await api.patch<{ question: Question }>(
    `/intakes/questions/${questionId}`,
    payload,
  )
  return data.question
}

export async function deleteQuestion(questionId: number): Promise<void> {
  await api.delete(`/intakes/questions/${questionId}`)
}

// ─── Opciones ───────────────────────────────────────────────────────────────

export async function createOption(
  questionId: number,
  payload: CreateOptionPayload,
): Promise<QuestionOption> {
  const { data } = await api.post<{ option: QuestionOption }>(
    `/intakes/questions/${questionId}/options`,
    payload,
  )
  return data.option
}

export async function updateOption(
  optionId: number,
  payload: UpdateOptionPayload,
): Promise<QuestionOption> {
  const { data } = await api.patch<{ option: QuestionOption }>(
    `/intakes/options/${optionId}`,
    payload,
  )
  return data.option
}

export async function deleteOption(optionId: number): Promise<void> {
  await api.delete(`/intakes/options/${optionId}`)
}

// ─── Mapeos ─────────────────────────────────────────────────────────────────

export async function createMapping(
  versionId: number,
  payload: CreateMappingPayload,
): Promise<IntakeMapping> {
  const { data } = await api.post<{ mapping: IntakeMapping }>(
    `/intakes/versions/${versionId}/mappings`,
    payload,
  )
  return data.mapping
}

export async function updateMapping(
  mappingId: number,
  payload: UpdateMappingPayload,
): Promise<IntakeMapping> {
  const { data } = await api.patch<{ mapping: IntakeMapping }>(
    `/intakes/mappings/${mappingId}`,
    payload,
  )
  return data.mapping
}

export async function deleteMapping(mappingId: number): Promise<void> {
  await api.delete(`/intakes/mappings/${mappingId}`)
}

// ─── Interpretación de rango ────────────────────────────────────────────────

export async function createRangeInterpretation(
  mappingId: number,
  payload: CreateRangeInterpretationPayload,
): Promise<RangeInterpretation> {
  const { data } = await api.post<{ interpretation: RangeInterpretation }>(
    `/intakes/mappings/${mappingId}/interpretations`,
    payload,
  )
  return data.interpretation
}

export async function updateRangeInterpretation(
  interpretationId: number,
  payload: UpdateRangeInterpretationPayload,
): Promise<RangeInterpretation> {
  const { data } = await api.patch<{ interpretation: RangeInterpretation }>(
    `/intakes/interpretations/${interpretationId}`,
    payload,
  )
  return data.interpretation
}

export async function deleteRangeInterpretation(interpretationId: number): Promise<void> {
  await api.delete(`/intakes/interpretations/${interpretationId}`)
}
