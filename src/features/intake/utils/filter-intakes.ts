import type { Intake } from '../types'

interface IntakeFilters {
  q?: string
  type?: string
}

export function filterIntakes(
  intakes: Intake[],
  filters: IntakeFilters,
): Intake[] {
  return intakes.filter((intake) => {
    if (filters.type && intake.type !== filters.type) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${intake.name} ${intake.description ?? ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
