import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { confirmRiskFactors, fetchRiskHistory, fetchRiskOverview } from '../services/risk.service'
import type { RiskFactorAnswers } from '../types'

export const riskKeys = {
  all: ['risk'] as const,
  overview: (patientId: number) => [...riskKeys.all, 'overview', patientId] as const,
  history: (patientId: number) => [...riskKeys.all, 'history', patientId] as const,
}

// Siempre fresco: el backend recalcula con los datos vigentes al consultarlo.
export function useRiskOverview(patientId: number) {
  return useQuery({
    queryKey: riskKeys.overview(patientId),
    queryFn: () => fetchRiskOverview(patientId),
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
      toast.success('Factores de riesgo guardados')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar los factores de riesgo'))
    },
  })
}
