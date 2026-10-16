import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createAnthropometry,
  fetchAnthropometriesByPatient,
  fetchAnthropometryByAppointment,
  fetchAnthropometryByConsultation,
  updateAnthropometry,
} from '../services/anthropometry.service'
import { anthropometryKeys } from './anthropometry.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { SaveAnthropometryInput } from '../types'

export function useAnthropometriesByPatient(
  patientId: number | undefined,
  consultationId?: number,
) {
  return useQuery({
    queryKey: anthropometryKeys.byPatient(patientId ?? 0, consultationId),
    queryFn: () => fetchAnthropometriesByPatient(patientId as number, consultationId),
    enabled: typeof patientId === 'number',
  })
}

export function useAnthropometryByConsultation(consultationId: number) {
  return useQuery({
    queryKey: anthropometryKeys.byConsultation(consultationId),
    queryFn: () => fetchAnthropometryByConsultation(consultationId),
  })
}

export function useAnthropometryByAppointment(appointmentId: number) {
  return useQuery({
    queryKey: anthropometryKeys.byAppointment(appointmentId),
    queryFn: () => fetchAnthropometryByAppointment(appointmentId),
  })
}

export function useSaveAnthropometry(
  existingId: number | undefined,
  options?: { onSuccess?: () => void },
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ patientId, consultationId, appointmentId, ...rest }: SaveAnthropometryInput) =>
      existingId
        ? updateAnthropometry(existingId, rest)
        : createAnthropometry({ patientId, consultationId, appointmentId, ...rest }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.all })
      toast.success('Antropometría guardada')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la antropometría'))
    },
  })
}
