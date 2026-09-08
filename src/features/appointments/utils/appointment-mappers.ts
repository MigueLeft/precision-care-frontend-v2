import type { Appointment, CreateAppointmentPayload } from '../types'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'
import { appointmentFormDefaultValues } from '../schemas/appointment-form.schema'
import {
  addMinutesIso,
  browserTimezone,
  combineDateTimeToUtc,
  getDurationMinutes,
  getPrimarySpecialist,
} from './appointment-helpers'

export function mapFormToPayload(
  values: AppointmentFormValues,
): CreateAppointmentPayload {
  const startAtUtc = combineDateTimeToUtc(values.date, values.time)
  return {
    patientId: values.patientId,
    startAtUtc,
    endAtUtc: addMinutesIso(startAtUtc, values.durationMin),
    originTimezone: browserTimezone,
    modality: values.modality,
    type: values.type,
    reason: values.reason?.trim() || undefined,
    telemedicineLink: values.telemedicineLink?.trim() || undefined,
    location: values.location?.trim() || undefined,
    specialistIds: [{ specialistId: values.specialistId, role: 'primary' }],
  }
}

export function mapAppointmentToForm(
  appointment: Appointment,
): AppointmentFormValues {
  const start = new Date(appointment.startAtUtc)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    ...appointmentFormDefaultValues,
    patientId: appointment.patientId,
    specialistId: getPrimarySpecialist(appointment)?.specialistId ?? 0,
    modality: appointment.modality,
    type: appointment.type ?? 'first_consultation',
    date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    durationMin: getDurationMinutes(appointment) || 30,
    reason: appointment.reason ?? '',
    telemedicineLink: appointment.telemedicineLink ?? '',
    location: appointment.location ?? '',
    remindEmail: true,
  }
}
