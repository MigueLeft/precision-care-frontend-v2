import { api } from '@/utils/api'
import type {
  Intake,
  IntakeDetailed,
  IntakeVersion,
  CreateIntakePayload,
  UpdateIntakePayload,
} from '../types'

export async function fetchIntakes(): Promise<Intake[]> {
  const { data } = await api.get<{ intakes: Intake[] }>('/intakes')
  return data.intakes
}

export async function fetchIntakeDetailed(id: number): Promise<IntakeDetailed> {
  const { data } = await api.get<{ intake: IntakeDetailed }>(`/intakes/${id}/detailed`)
  return data.intake
}

export async function createIntake(payload: CreateIntakePayload): Promise<Intake> {
  const { data } = await api.post<{ intake: Intake }>('/intakes', payload)
  return data.intake
}

export async function updateIntake(id: number, payload: UpdateIntakePayload): Promise<Intake> {
  const { data } = await api.patch<{ intake: Intake }>(`/intakes/${id}`, payload)
  return data.intake
}

export async function deleteIntake(id: number): Promise<Intake> {
  const { data } = await api.delete<{ intake: Intake }>(`/intakes/${id}`)
  return data.intake
}

export async function getEditableVersion(intakeId: number): Promise<IntakeVersion> {
  const { data } = await api.post<{ version: IntakeVersion }>(
    `/intakes/${intakeId}/versions/editable`,
  )
  return data.version
}

export async function publishVersion(versionId: number): Promise<IntakeVersion> {
  const { data } = await api.post<{ version: IntakeVersion }>(
    `/intakes/versions/${versionId}/publish`,
  )
  return data.version
}
