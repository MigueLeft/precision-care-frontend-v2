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
      // También por teléfono, ignorando espacios y signos ("0412 123" o "+58412").
      // Sin el 0 inicial del formato local: "0412…" coincide con "+58412…".
      const needleDigits = needle.replace(/\D/g, '').replace(/^0+/, '')
      const phoneMatch = needleDigits.length >= 3 && (patient.phone ?? '').includes(needleDigits)
      if (!haystack.includes(needle) && !phoneMatch) return false
    }
    return true
  })
}
