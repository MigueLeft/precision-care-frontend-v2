import type { Patient } from '../types'
import { formatPatientName } from './patient-format'

interface PatientFilters {
  q?: string
  nationalityCountryId?: number
}

// Filtrado 100% en cliente: el backend no soporta parámetros de búsqueda/paginación.
export function filterPatients(patients: Patient[], filters: PatientFilters): Patient[] {
  return patients.filter((patient) => {
    if (filters.nationalityCountryId && patient.nationalityCountryId !== filters.nationalityCountryId) {
      return false
    }
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${formatPatientName(patient)} ${patient.email ?? ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
