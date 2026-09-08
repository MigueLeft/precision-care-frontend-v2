import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchConsultation,
  fetchConsultationByAppointment,
  fetchConsultationDiagnoses,
  fetchConsultationSymptoms,
  fetchConsultationSymptomHistory,
  updateConsultation,
  replaceConsultationSymptoms,
  type UpdateConsultationPatch,
} from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { ReplaceSymptomInput } from '../types'

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

// Autoguardado: sin toast en éxito, solo en error.
export function useUpdateConsultation(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: UpdateConsultationPatch) => updateConsultation(id, patch),
    onSuccess: (consultation) => {
      queryClient.setQueryData(consultationsKeys.detail(id), consultation)
      queryClient.invalidateQueries({ queryKey: consultationsKeys.all })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la consulta'))
    },
  })
}

export function useReplaceConsultationSymptoms(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (symptoms: ReplaceSymptomInput[]) =>
      replaceConsultationSymptoms(id, symptoms),
    onSuccess: (symptoms) => {
      queryClient.setQueryData(consultationsKeys.symptoms(id), symptoms)
      queryClient.invalidateQueries({
        queryKey: consultationsKeys.symptomHistory(id),
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar los síntomas'))
    },
  })
}
