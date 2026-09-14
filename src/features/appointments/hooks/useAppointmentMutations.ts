import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createAppointment,
  updateAppointment,
  startConsultationForAppointment,
  sendAppointmentReminder,
  sendIntakeAssignment,
} from '../services/appointments.service'
import { appointmentsKeys } from './appointments.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Consultation } from '@/features/consultations'
import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../types'

function useInvalidateAppointments() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({ queryKey: appointmentsKeys.all })
}

export function useCreateAppointment(options?: { onSuccess?: (a: Appointment) => void }) {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => createAppointment(payload),
    onSuccess: (appointment) => {
      invalidate()
      toast.success('Cita creada correctamente')
      options?.onSuccess?.(appointment)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la cita'))
    },
  })
}

export function useUpdateAppointment(options?: { onSuccess?: (a: Appointment) => void }) {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAppointmentPayload }) =>
      updateAppointment(id, payload),
    onSuccess: (appointment) => {
      invalidate()
      toast.success('Cita actualizada correctamente')
      options?.onSuccess?.(appointment)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la cita'))
    },
  })
}

export function useCancelAppointment(options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: (id: number) =>
      updateAppointment(id, { status: 'cancelled_by_clinic' }),
    onSuccess: () => {
      invalidate()
      toast.success('Cita cancelada')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cancelar la cita'))
    },
  })
}

export function useStartConsultation(options?: {
  onSuccess?: (result: { appointment: Appointment; consultation: Consultation }) => void
}) {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: (id: number) => startConsultationForAppointment(id),
    onSuccess: (result) => {
      invalidate()
      options?.onSuccess?.(result)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al iniciar la consulta'))
    },
  })
}

export function useSendReminder(options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: (id: number) => sendAppointmentReminder(id),
    onSuccess: ({ sent }) => {
      invalidate()
      toast.success(
        sent
          ? 'Recordatorio enviado por email'
          : 'Recordatorio registrado (SMTP no configurado, no se envió)',
      )
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al enviar el recordatorio'))
    },
  })
}

export function useSendIntakeAssignment(options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateAppointments()
  return useMutation({
    mutationFn: ({
      appointmentId,
      intakeVersionId,
    }: {
      appointmentId: number
      intakeVersionId: number
    }) => sendIntakeAssignment(appointmentId, intakeVersionId),
    onSuccess: ({ sent }) => {
      invalidate()
      toast.success(
        sent
          ? 'Ingresable enviado por email'
          : 'Ingresable asignado (no se pudo notificar por email)',
      )
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al asignar el ingresable'))
    },
  })
}
