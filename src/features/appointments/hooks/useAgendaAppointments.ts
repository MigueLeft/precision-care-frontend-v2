import { canViewAllAppointments, canViewUnconfirmedAppointments, useMe } from '@/features/identity'
import type { Appointment } from '../types'
import { toDateKey, visibleRange } from '../utils/calendar-dates'
import { filterAppointments, type AppointmentFilters } from '../utils/filter-appointments'
import { useAppointments } from './useAppointments'

// Citas de la agenda móvil ya filtradas por permisos y filtros: las del día
// elegido, las del periodo visible (semana/mes) y cuántas hay por día.
export function useAgendaAppointments(filters: AppointmentFilters, selected: Date, period: 'week' | 'month') {
  const query = useAppointments()
  const { data: me } = useMe()
  const canViewAll = canViewAllAppointments(me)
  const canViewUnconfirmed = canViewUnconfirmedAppointments(me)
  const context = {
    mySpecialistId: me?.specialistId ?? null,
    restrictToMine: !canViewAll,
    hideUnconfirmed: !canViewUnconfirmed,
  }
  const all = query.data ?? []
  const byStart = (a: Appointment, b: Appointment) =>
    new Date(a.startAtUtc).getTime() - new Date(b.startAtUtc).getTime()

  const periodAppointments = filterAppointments(all, filters, { ...context, range: visibleRange(period, selected) })
  const dayAppointments = filterAppointments(all, filters, { ...context, range: visibleRange('day', selected) }).sort(byStart)
  const countByDay = new Map<string, number>()
  for (const appointment of periodAppointments) {
    const key = toDateKey(new Date(appointment.startAtUtc))
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1)
  }

  return {
    ...query,
    me,
    canViewAll,
    canViewUnconfirmed,
    all,
    periodAppointments,
    dayAppointments,
    countByDay,
  }
}
