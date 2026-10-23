// Fechas del calendario de citas (hora local del navegador). La semana
// empieza en lunes, como se acostumbra en español.

export type CalendarView = 'list' | 'week' | 'month'

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function startOfWeek(date: Date): Date {
  const day = startOfDay(date)
  const fromMonday = (day.getDay() + 6) % 7
  return addDays(day, -fromMonday)
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// "2026-10-23" en hora local (lo que espera el formulario de la cita).
export function toDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA')
}

export function weekDays(anchor: Date): Date[] {
  const monday = startOfWeek(anchor)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

// 6 semanas completas que cubren el mes del ancla (como Google Calendar).
export function monthGridDays(anchor: Date): Date[] {
  const first = startOfWeek(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
  return Array.from({ length: 42 }, (_, i) => addDays(first, i))
}

// Rango visible [start, end) para filtrar las citas de la vista.
export function visibleRange(view: CalendarView, anchor: Date): { start: Date; end: Date } | null {
  if (view === 'week') {
    const start = startOfWeek(anchor)
    return { start, end: addDays(start, 7) }
  }
  if (view === 'month') {
    const days = monthGridDays(anchor)
    return { start: days[0], end: addDays(days[41], 1) }
  }
  return null
}

export function shiftAnchor(view: CalendarView, anchor: Date, direction: 1 | -1): Date {
  if (view === 'month') return new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1)
  return addDays(anchor, 7 * direction)
}

const MONTH_YEAR = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' })
const DAY_MONTH = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })

// "octubre de 2026" (mes) o "20 – 26 oct 2026" / "29 sept – 4 oct 2026" (semana).
export function calendarTitle(view: CalendarView, anchor: Date): string {
  if (view === 'month') return MONTH_YEAR.format(anchor)
  const days = weekDays(anchor)
  const first = days[0]
  const last = days[6]
  const firstLabel =
    first.getMonth() === last.getMonth() ? String(first.getDate()) : DAY_MONTH.format(first).replace('.', '')
  return `${firstLabel} – ${DAY_MONTH.format(last).replace('.', '')} ${last.getFullYear()}`
}

export const WEEKDAY_SHORT = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

const TIME = new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })

// "9:30 a.m." para las tarjetas del calendario.
export function formatTime(date: Date): string {
  return TIME.format(date).replace(/\s/g, ' ')
}

// Etiqueta de la hora en la columna izquierda ("9 a.m.", "1 p.m.").
export function hourLabel(hour: number): string {
  const suffix = hour < 12 ? 'a.m.' : 'p.m.'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h} ${suffix}`
}
