import type { Appointment, AppointmentModality, AppointmentStatus } from '../types'
import { getPrimarySpecialist } from './appointment-helpers'

export interface AppointmentFilters {
  scope: 'mine' | 'all'
  q: string
  from: string
  to: string
  statuses: AppointmentStatus[]
  modality: AppointmentModality | ''
  specialistId: number | ''
}

// Por defecto se muestran solo las citas programadas y en curso.
export const defaultAppointmentFilters: AppointmentFilters = {
  scope: 'all',
  q: '',
  from: '',
  to: '',
  statuses: ['scheduled', 'in_progress'],
  modality: '',
  specialistId: '',
}

export function isDefaultFilters(filters: AppointmentFilters): boolean {
  return (
    filters.scope === defaultAppointmentFilters.scope &&
    filters.q === '' &&
    filters.from === '' &&
    filters.to === '' &&
    filters.modality === '' &&
    filters.specialistId === '' &&
    filters.statuses.length === defaultAppointmentFilters.statuses.length &&
    defaultAppointmentFilters.statuses.every((s) => filters.statuses.includes(s))
  )
}

export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilters,
  mySpecialistId: number | null,
): Appointment[] {
  return appointments.filter((appointment) => {
    // Un especialista solo ve sus propias citas; el resto puede usar el toggle.
    const onlyMine = mySpecialistId != null || filters.scope === 'mine'
    if (
      onlyMine &&
      mySpecialistId != null &&
      !appointment.specialists.some((s) => s.specialistId === mySpecialistId)
    ) {
      return false
    }
    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(appointment.status)
    ) {
      return false
    }
    if (filters.modality && appointment.modality !== filters.modality) return false
    if (
      filters.specialistId &&
      getPrimarySpecialist(appointment)?.specialistId !== filters.specialistId
    ) {
      return false
    }
    const startDay = new Date(appointment.startAtUtc).toLocaleDateString('en-CA')
    if (filters.from && startDay < filters.from) return false
    if (filters.to && startDay > filters.to) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${appointment.patientName ?? ''} ${appointment.reason ?? ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
