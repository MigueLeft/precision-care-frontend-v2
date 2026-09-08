import type { AntecedentStatus, AntecedentType } from '../types'

export const ANTECEDENT_STATUS_LABELS: Record<AntecedentStatus, string> = {
  active: 'Activo',
  in_follow_up: 'En seguimiento',
  resolved: 'Resuelto',
  inactive: 'Inactivo',
}

export const ANTECEDENT_STATUS_COLORS: Record<
  AntecedentStatus,
  'error' | 'warning' | 'success' | 'default'
> = {
  active: 'error',
  in_follow_up: 'warning',
  resolved: 'success',
  inactive: 'default',
}

export const ANTECEDENT_TYPE_LABELS: Record<AntecedentType, string> = {
  family: 'Familiar',
  personal: 'Personal',
  surgery: 'Cirugía',
  hospitalization: 'Hospitalización',
  other: 'Otro',
}

// "ene 2019" a partir de una fecha AAAA-MM-DD.
export function formatEventDate(eventDate: string | null): string {
  if (!eventDate) return '—'
  const date = new Date(`${eventDate}T00:00:00`)
  return new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}
