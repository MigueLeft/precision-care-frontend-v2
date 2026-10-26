import { api } from '@/utils/api'
import type { RiskCalculation, RiskFactorAnswers, RiskOverview } from '../types'

export async function fetchRiskOverview(patientId: number): Promise<RiskOverview> {
  const { data } = await api.get<RiskOverview>(`/risk/patient/${patientId}`)
  return data
}

export async function fetchRiskHistory(patientId: number): Promise<RiskCalculation[]> {
  const { data } = await api.get<{ calculations: RiskCalculation[] }>(
    `/risk/patient/${patientId}/history`,
  )
  return data.calculations
}

export async function confirmRiskFactors(
  patientId: number,
  answers: RiskFactorAnswers & { consultationId?: number | null },
): Promise<RiskOverview> {
  const { data } = await api.post<RiskOverview>(`/risk/patient/${patientId}/confirmation`, answers)
  return data
}
