import type { Appointment, AppointmentModality, AppointmentStatus } from '../types'
import { getPrimarySpecialist } from './appointment-helpers'

export interface AppointmentFilters {
  scope: 'mine' | 'all'
  q: string
  from: string
  to: string
  status: AppointmentStatus | ''
  modality: AppointmentModality | ''
  specialistId: number | ''
}

export const defaultAppointmentFilters: AppointmentFilters = {
  scope: 'all',
  q: '',
  from: '',
  to: '',
  status: '',
  modality: '',
  specialistId: '',
}

export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilters,
  mySpecialistId: number | null,
): Appointment[] {
  return appointments.filter((appointment) => {
    if (
      filters.scope === 'mine' &&
      mySpecialistId != null &&
      !appointment.specialists.some((s) => s.specialistId === mySpecialistId)
    ) {
      return false
    }
    if (filters.status && appointment.status !== filters.status) return false
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
