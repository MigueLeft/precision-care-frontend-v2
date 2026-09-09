import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchConsultation,
  fetchConsultationByAppointment,
  fetchConsultationDiagnoses,
  fetchConsultationSymptoms,
  fetchConsultationSymptomHistory,
  fetchConsultationRecorded,
  updateConsultation,
  addConsultationSymptom,
  captureConsultationSymptom,
  removeConsultationSymptom,
  type UpdateConsultationPatch,
} from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { AddSymptomInput, CaptureSymptomInput } from '../types'

export function useConsultation(id: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.detail(id ?? 0),
    queryFn: () => fetchConsultation(id as number),
    enabled: typeof id === 'number',
  })
}

export function useConsultationByAppointment(appointmentId: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.byAppointment(appointmentId ?? 0),
    queryFn: () => fetchConsultationByAppointment(appointmentId as number),
    enabled: typeof appointmentId === 'number',
  })
}

export function useConsultationDiagnoses(id: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.diagnoses(id ?? 0),
    queryFn: () => fetchConsultationDiagnoses(id as number),
    enabled: typeof id === 'number',
  })
}

export function useConsultationSymptoms(id: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.symptoms(id ?? 0),
    queryFn: () => fetchConsultationSymptoms(id as number),
    enabled: typeof id === 'number',
  })
}

export function useConsultationSymptomHistory(id: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.symptomHistory(id ?? 0),
    queryFn: () => fetchConsultationSymptomHistory(id as number),
    enabled: typeof id === 'number',
  })
}

export function useConsultationRecorded(id: number | undefined) {
  return useQuery({
    queryKey: consultationsKeys.recorded(id ?? 0),
    queryFn: () => fetchConsultationRecorded(id as number),
    enabled: typeof id === 'number',
  })
}

// Autoguardado: sin toast en éxito, solo en error.
export function useUpdateConsultation(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: UpdateConsultationPatch) => updateConsultation(id, patch),
    onSuccess: (consultation) => {
      queryClient.setQueryData(consultationsKeys.detail(id), consultation)
      queryClient.invalidateQueries({ queryKey: consultationsKeys.all })
      // Finalizar la consulta también cambia el estado de la cita ligada.
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la consulta'))
    },
  })
}

// Invalidación compartida tras cualquier cambio de síntomas de la consulta.
function useSymptomMutation<TArgs>(
  id: number,
  fn: (args: TArgs) => Promise<unknown>,
  errorMessage: string,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationsKeys.symptoms(id) })
      queryClient.invalidateQueries({
        queryKey: consultationsKeys.symptomHistory(id),
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, errorMessage))
    },
  })
}

export function useAddConsultationSymptom(id: number) {
  return useSymptomMutation(
    id,
    (input: AddSymptomInput) => addConsultationSymptom(id, input),
    'Error al añadir el síntoma',
  )
}

export function useCaptureConsultationSymptom(id: number) {
  return useSymptomMutation(
    id,
    ({ symptomId, input }: { symptomId: number; input: CaptureSymptomInput }) =>
      captureConsultationSymptom(id, symptomId, input),
    'Error al guardar el síntoma',
  )
}

export function useRemoveConsultationSymptom(id: number) {
  return useSymptomMutation(
    id,
    (symptomId: number) => removeConsultationSymptom(id, symptomId),
    'Error al quitar el síntoma',
  )
}
