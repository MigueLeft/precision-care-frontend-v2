import type { Appointment, AppointmentModality, AppointmentStatus } from '../types'
import { getPrimarySpecialist } from './appointment-helpers'
import { isUnconfirmed } from './calendar-colors'

export type ConfirmationFilter = '' | 'confirmed' | 'unconfirmed'

export interface AppointmentFilters {
  scope: 'mine' | 'all'
  q: string
  from: string
  to: string
  statuses: AppointmentStatus[]
  modality: AppointmentModality | ''
  specialistId: number | ''
  confirmation: ConfirmationFilter
}

// Por defecto se muestran las citas vigentes: programadas, confirmadas y en curso.
export const defaultAppointmentFilters: AppointmentFilters = {
  scope: 'all',
  q: '',
  from: '',
  to: '',
  statuses: ['scheduled', 'confirmed', 'in_progress'],
  modality: '',
  specialistId: '',
  confirmation: '',
}

export function isDefaultFilters(filters: AppointmentFilters): boolean {
  return (
    filters.scope === defaultAppointmentFilters.scope &&
    filters.q === '' &&
    filters.from === '' &&
    filters.to === '' &&
    filters.modality === '' &&
    filters.specialistId === '' &&
    filters.confirmation === '' &&
    filters.statuses.length === defaultAppointmentFilters.statuses.length &&
    defaultAppointmentFilters.statuses.every((s) => filters.statuses.includes(s))
  )
}

interface FilterContext {
  mySpecialistId: number | null
  // Especialista sin permiso para ver todas: solo sus citas, y solo las
  // confirmadas (las programadas aún no se le muestran).
  restrictToMine: boolean
  // Calendario: rango visible; la lista usa las fechas "desde/hasta".
  range?: { start: Date; end: Date } | null
}

export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilters,
  { mySpecialistId, restrictToMine, range }: FilterContext,
): Appointment[] {
  return appointments.filter((appointment) => {
    const onlyMine = restrictToMine || filters.scope === 'mine'
    if (
      onlyMine &&
      mySpecialistId != null &&
      !appointment.specialists.some((s) => s.specialistId === mySpecialistId)
    ) {
      return false
    }
    if (restrictToMine && isUnconfirmed(appointment)) return false
    if (filters.confirmation === 'confirmed' && isUnconfirmed(appointment)) return false
    if (filters.confirmation === 'unconfirmed' && !isUnconfirmed(appointment)) return false
    if (filters.statuses.length > 0 && !filters.statuses.includes(appointment.status)) {
      return false
    }
    if (filters.modality && appointment.modality !== filters.modality) return false
    if (
      filters.specialistId &&
      getPrimarySpecialist(appointment)?.specialistId !== filters.specialistId
    ) {
      return false
    }
    const start = new Date(appointment.startAtUtc)
    if (range) {
      if (start < range.start || start >= range.end) return false
    } else {
      const startDay = start.toLocaleDateString('en-CA')
      if (filters.from && startDay < filters.from) return false
      if (filters.to && startDay > filters.to) return false
    }
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${appointment.patientName ?? ''} ${appointment.reason ?? ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
