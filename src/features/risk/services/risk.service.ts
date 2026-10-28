import { api } from '@/utils/api'
import type { Cha2ds2Assessment, RiskCalculation, RiskFactorAnswers, RiskOverview } from '../types'

// includeLegacyPce: agrega la PCE (Goff 2013) como comparativo heredado.
export async function fetchRiskOverview(patientId: number, includeLegacyPce = false): Promise<RiskOverview> {
  const { data } = await api.get<RiskOverview>(`/risk/patient/${patientId}`, {
    params: includeLegacyPce ? { includeLegacyPce: true } : undefined,
  })
  return data
}

export async function fetchRiskHistory(patientId: number): Promise<RiskCalculation[]> {
  const { data } = await api.get<{ calculations: RiskCalculation[] }>(
    `/risk/patient/${patientId}/history`,
  )
  return data.calculations
}

// CHA2DS2-VASc / CHA2DS2-VA (prevención del ACV en FA), calculado al momento.
export async function evaluateStrokePreventionAf(patientId: number): Promise<Cha2ds2Assessment> {
  const { data } = await api.post<{ cha2ds2: Cha2ds2Assessment }>(
    `/risk/patient/${patientId}/stroke-prevention-af`,
  )
  return data.cha2ds2
}

export async function confirmRiskFactors(
  patientId: number,
  answers: RiskFactorAnswers & { consultationId?: number | null },
): Promise<RiskOverview> {
  const { data } = await api.post<RiskOverview>(`/risk/patient/${patientId}/confirmation`, answers)
  return data
}
