import type { SymptomCatalog } from '../types'

interface SymptomFilters {
  q?: string
  bodySystemId?: number
  onlyActive?: boolean
}

export function filterSymptoms(symptoms: SymptomCatalog[], filters: SymptomFilters): SymptomCatalog[] {
  return symptoms.filter((symptom) => {
    if (filters.onlyActive && !symptom.active) return false
    if (filters.bodySystemId && symptom.bodySystemId !== filters.bodySystemId) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      if (!symptom.name.toLowerCase().includes(needle)) return false
    }
    return true
  })
}
