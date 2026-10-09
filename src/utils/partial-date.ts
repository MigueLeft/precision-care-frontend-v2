// Fechas clínicas parciales: mes y año ('YYYY-MM') o completas ('YYYY-MM-DD').
// El paciente suele no recordar el día, así que el día es opcional.

export interface PartialDateParts {
  year: string
  month: string
  day: string
}

export const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export const MIN_PARTIAL_DATE_YEAR = 1900

export const PARTIAL_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/

export function parsePartialDate(value: string | null | undefined): PartialDateParts {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(value ?? '')
  if (!match) return { year: '', month: '', day: '' }
  return { year: match[1], month: match[2], day: match[3] ?? '' }
}

export function daysInMonth(year: string, month: string): number {
  if (!month) return 31
  // Sin año válido se asume uno bisiesto para permitir el 29 de febrero.
  const fullYear = /^\d{4}$/.test(year) ? Number(year) : 2000
  return new Date(fullYear, Number(month), 0).getDate()
}

export function isValidPartialYear(year: string): boolean {
  if (!/^\d{4}$/.test(year)) return false
  const numeric = Number(year)
  return numeric >= MIN_PARTIAL_DATE_YEAR && numeric <= new Date().getFullYear()
}

// Valor a guardar; vacío mientras falte el mes o el año (o el año sea inválido).
export function composePartialDate({ year, month, day }: PartialDateParts): string {
  if (!month || !isValidPartialYear(year)) return ''
  return day ? `${year}-${month}-${day}` : `${year}-${month}`
}
