import type { Appointment } from '../types'
import { isSameDay } from './calendar-dates'

const MINUTES_PER_DAY = 24 * 60
// Altura mínima visible de una cita corta (en minutos de la cuadrícula).
const MIN_VISIBLE_MINUTES = 20

export interface PositionedAppointment {
  appointment: Appointment
  start: Date
  end: Date
  // Porcentajes dentro de la columna del día.
  top: number
  height: number
  left: number
  width: number
}

const minutesOfDay = (date: Date) => date.getHours() * 60 + date.getMinutes()

// Acomoda las citas de un día como Google Calendar: las que se enciman se
// reparten el ancho en columnas lado a lado.
export function layoutDay(appointments: Appointment[], day: Date): PositionedAppointment[] {
  const events = appointments
    .map((appointment) => ({
      appointment,
      start: new Date(appointment.startAtUtc),
      end: new Date(appointment.endAtUtc),
    }))
    .filter((event) => isSameDay(event.start, day))
    .sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime())

  const positioned: PositionedAppointment[] = []
  let cluster: { event: (typeof events)[number]; column: number }[] = []
  let clusterEnd = 0

  const flush = () => {
    const columns = Math.max(1, ...cluster.map((item) => item.column + 1))
    for (const { event, column } of cluster) {
      const startMin = minutesOfDay(event.start)
      const duration = Math.max((event.end.getTime() - event.start.getTime()) / 60000, MIN_VISIBLE_MINUTES)
      positioned.push({
        ...event,
        top: (startMin / MINUTES_PER_DAY) * 100,
        height: (Math.min(duration, MINUTES_PER_DAY - startMin) / MINUTES_PER_DAY) * 100,
        left: (column / columns) * 100,
        width: 100 / columns,
      })
    }
    cluster = []
  }

  for (const event of events) {
    if (cluster.length > 0 && event.start.getTime() >= clusterEnd) flush()
    // Primera columna libre (cuya última cita ya terminó).
    const used = cluster.filter((item) => item.event.end.getTime() > event.start.getTime()).map((i) => i.column)
    let column = 0
    while (used.includes(column)) column++
    cluster.push({ event, column })
    clusterEnd = Math.max(clusterEnd, event.end.getTime())
  }
  if (cluster.length > 0) flush()
  return positioned
}

// Citas de un día ordenadas por hora (vista de mes).
export function appointmentsOfDay(appointments: Appointment[], day: Date): Appointment[] {
  return appointments
    .filter((appointment) => isSameDay(new Date(appointment.startAtUtc), day))
    .sort((a, b) => new Date(a.startAtUtc).getTime() - new Date(b.startAtUtc).getTime())
}
