import type {
  Appointment,
  AppointmentModality,
  AppointmentStatus,
  AppointmentType,
} from '../types'

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  in_progress: 'En curso',
  completed: 'Terminada',
  cancelled_by_patient: 'Cancelada por paciente',
  cancelled_by_clinic: 'Cancelada por clínica',
  no_show: 'No asistió',
}

export const APPOINTMENT_STATUS_COLORS: Record<
  AppointmentStatus,
  'success' | 'info' | 'warning' | 'default' | 'error'
> = {
  scheduled: 'default',
  confirmed: 'info',
  in_progress: 'success',
  completed: 'success',
  cancelled_by_patient: 'error',
  cancelled_by_clinic: 'error',
  no_show: 'warning',
}

export const APPOINTMENT_MODALITY_LABELS: Record<AppointmentModality, string> = {
  in_person: 'Presencial',
  telemedicine: 'Telemedicina',
}

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  first_consultation: 'Primera consulta',
  with_specialist: 'Con especialista',
  follow_up: 'Control',
}

const CANCELLED_STATUSES: AppointmentStatus[] = [
  'cancelled_by_patient',
  'cancelled_by_clinic',
  'no_show',
]

export function isCancelled(status: AppointmentStatus): boolean {
  return CANCELLED_STATUSES.includes(status)
}

// Citas futuras vigentes, más próximas primero.
export function getUpcomingAppointments(appointments: Appointment[]): Appointment[] {
  const now = Date.now()
  return appointments
    .filter(
      (appointment) =>
        new Date(appointment.startAtUtc).getTime() >= now &&
        !isCancelled(appointment.status) &&
        appointment.status !== 'completed',
    )
    .sort(
      (a, b) =>
        new Date(a.startAtUtc).getTime() - new Date(b.startAtUtc).getTime(),
    )
}

export function getPrimarySpecialist(appointment: Appointment) {
  return (
    appointment.specialists.find((s) => s.role === 'primary') ??
    appointment.specialists[0] ??
    null
  )
}

export function getPrimarySpecialistName(appointment: Appointment): string | null {
  return getPrimarySpecialist(appointment)?.fullName ?? null
}

export function getDurationMinutes(appointment: Appointment): number {
  return Math.round(
    (new Date(appointment.endAtUtc).getTime() -
      new Date(appointment.startAtUtc).getTime()) /
      60000,
  )
}

// Combina fecha (AAAA-MM-DD) + hora (HH:mm) en la zona del navegador → ISO UTC.
export function combineDateTimeToUtc(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString()
}

export function addMinutesIso(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString()
}

export const browserTimezone: string =
  Intl.DateTimeFormat().resolvedOptions().timeZone
