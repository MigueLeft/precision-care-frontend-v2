import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  confirmRiskFactors,
  evaluateStrokePreventionAf,
  fetchRiskHistory,
  fetchRiskOverview,
} from '../services/risk.service'
import type { RiskFactorAnswers } from '../types'

export const riskKeys = {
  all: ['risk'] as const,
  overview: (patientId: number) => [...riskKeys.all, 'overview', patientId] as const,
  // Mismo resumen más la PCE heredada (se pide aparte, a demanda).
  overviewWithPce: (patientId: number) => [...riskKeys.all, 'overview-pce', patientId] as const,
  history: (patientId: number) => [...riskKeys.all, 'history', patientId] as const,
  cha2ds2: (patientId: number) => [...riskKeys.all, 'cha2ds2', patientId] as const,
}

// Siempre fresco: el backend recalcula con los datos vigentes al consultarlo.
export function useRiskOverview(patientId: number) {
  return useQuery({
    queryKey: riskKeys.overview(patientId),
    queryFn: () => fetchRiskOverview(patientId),
    staleTime: 0,
  })
}

export function useLegacyPce(patientId: number, enabled: boolean) {
  return useQuery({
    queryKey: riskKeys.overviewWithPce(patientId),
    queryFn: () => fetchRiskOverview(patientId, true),
    select: (overview) => overview.assessment.pce,
    enabled,
    staleTime: 0,
  })
}

export function useStrokePreventionAf(patientId: number, enabled: boolean) {
  return useQuery({
    queryKey: riskKeys.cha2ds2(patientId),
    queryFn: () => evaluateStrokePreventionAf(patientId),
    enabled,
    staleTime: 0,
  })
}

export function useRiskHistory(patientId: number) {
  return useQuery({
    queryKey: riskKeys.history(patientId),
    queryFn: () => fetchRiskHistory(patientId),
    staleTime: 0,
  })
}

export function useConfirmRiskFactors(patientId: number, consultationId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (answers: RiskFactorAnswers) =>
      confirmRiskFactors(patientId, { ...answers, consultationId }),
    onSuccess: (overview) => {
      queryClient.setQueryData(riskKeys.overview(patientId), overview)
      queryClient.invalidateQueries({ queryKey: riskKeys.history(patientId) })
      queryClient.invalidateQueries({ queryKey: riskKeys.cha2ds2(patientId) })
      queryClient.invalidateQueries({ queryKey: riskKeys.overviewWithPce(patientId) })
      toast.success('Factores de riesgo guardados')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar los factores de riesgo'))
    },
  })
}
