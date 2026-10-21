// Conversión entre la hora "HH:mm" (24 h, la que viaja al backend) y sus
// partes en formato de 12 horas para los selectores.

export type Period = 'am' | 'pm'

export interface Time12hParts {
  hour: number // 1–12
  minute: string // "00"–"59"
  period: Period
}

export const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1)

export function minuteOptions(step: number): string[] {
  return Array.from({ length: Math.ceil(60 / step) }, (_, i) =>
    String(i * step).padStart(2, '0'),
  )
}

export function parseTime24(value: string): Time12hParts {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  const hour24 = match ? Number(match[1]) : 9
  return {
    hour: hour24 % 12 === 0 ? 12 : hour24 % 12,
    minute: match ? match[2] : '00',
    period: hour24 >= 12 ? 'pm' : 'am',
  }
}

export function composeTime24({ hour, minute, period }: Time12hParts): string {
  const hour24 = (hour % 12) + (period === 'pm' ? 12 : 0)
  return `${String(hour24).padStart(2, '0')}:${minute}`
}
