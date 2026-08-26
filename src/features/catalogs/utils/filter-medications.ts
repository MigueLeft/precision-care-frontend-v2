import type { Medication } from '../types'

interface MedicationFilters {
  q?: string
  category?: string
  onlyActive?: boolean
}

export function filterMedications(medications: Medication[], filters: MedicationFilters): Medication[] {
  return medications.filter((medication) => {
    if (filters.onlyActive && !medication.active) return false
    if (filters.category && medication.category !== filters.category) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${medication.brandName} ${medication.genericName}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
