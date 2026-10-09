import { formatFreeDate } from '@/utils/format-date'
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

// "10/05/2020" (fecha completa) o "05/2020" (solo mes y año).
export function formatEventDate(eventDate: string | null): string {
  return formatFreeDate(eventDate)
}
