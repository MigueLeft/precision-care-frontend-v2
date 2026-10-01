import { api } from '@/utils/api'
import type { IntakeResponseDetail } from '@/features/intake-responses'
import type { PublicIntakeCatalogs } from '../types'

export interface PublicAnswerPayload {
  questionId: number
  optionId?: number
  textValue?: string
  numericValue?: number
  dateValue?: string
  booleanValue?: boolean
}

export async function fetchPublicIntakeResponse(
  token: string,
): Promise<IntakeResponseDetail> {
  const { data } = await api.get<{ response: IntakeResponseDetail }>(
    `/public/intake-responses/${token}`,
  )
  return data.response
}

export async function fetchPublicIntakeCatalogs(
  token: string,
): Promise<PublicIntakeCatalogs> {
  const { data } = await api.get<{ catalogs: PublicIntakeCatalogs }>(
    `/public/intake-responses/${token}/catalogs`,
  )
  return data.catalogs
}

export async function submitPublicAnswer(
  token: string,
  payload: PublicAnswerPayload,
): Promise<void> {
  await api.post(`/public/intake-responses/${token}/answers`, payload)
}

export async function completePublicIntakeResponse(token: string): Promise<void> {
  await api.patch(`/public/intake-responses/${token}/complete`)
}
