import type { Patient } from '../types'
import { formatPatientName } from './patient-format'

export const PATIENTS_PAGE_SIZE = 10

// Orden alfabético por el nombre como se muestra (apellidos primero).
export function sortPatientsByName(patients: Patient[]): Patient[] {
  return [...patients].sort((a, b) =>
    formatPatientName(a).localeCompare(formatPatientName(b), 'es', { sensitivity: 'base' }),
  )
}

// Página pedida acotada al rango disponible (al filtrar puede quedar fuera).
export function clampPage(page: number | undefined, total: number) {
  const pageCount = Math.max(1, Math.ceil(total / PATIENTS_PAGE_SIZE))
  return Math.min(Math.max(page ?? 1, 1), pageCount)
}

export function pagePatients(patients: Patient[], page: number): Patient[] {
  const start = (page - 1) * PATIENTS_PAGE_SIZE
  return patients.slice(start, start + PATIENTS_PAGE_SIZE)
}
