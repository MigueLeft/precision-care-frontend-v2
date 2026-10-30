import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { lifestyleKeys } from '@/features/lifestyle'
import { intakeResponsesKeys } from '@/features/intake-responses'
import { anthropometryKeys } from '@/features/anthropometry'
import { paraclinicalKeys } from '@/features/paraclinical'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { completeLifestyle, fetchLifestylePending } from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'
import type { LifestyleAnswerInput } from '../types'

// Preguntas del IM1 que faltan para el Life's Essential 8 (glucosa, lípidos,
// presión arterial, ejercicio e IMC).
export function useLifestylePending(consultationId: number, enabled = true) {
  return useQuery({
    queryKey: consultationsKeys.lifestylePending(consultationId),
    queryFn: () => fetchLifestylePending(consultationId),
    enabled,
  })
}

// Guarda las respuestas faltantes: el backend las agrega al IM1, carga los
// valores en Antropometría / Paraclínicos de la consulta y recalcula el LE8.
export function useCompleteLifestyle(consultationId: number, patientId: number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (answers: LifestyleAnswerInput[]) => completeLifestyle(consultationId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationsKeys.lifestylePending(consultationId) })
      queryClient.invalidateQueries({ queryKey: lifestyleKeys.byPatient(patientId) })
      queryClient.invalidateQueries({ queryKey: intakeResponsesKeys.all })
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.all })
      queryClient.invalidateQueries({ queryKey: paraclinicalKeys.all })
      toast.success('Datos guardados · estilo de vida recalculado')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudieron guardar los datos de estilo de vida.'))
    },
  })
}
