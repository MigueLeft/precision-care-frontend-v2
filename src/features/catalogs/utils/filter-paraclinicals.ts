import type { ParaclinicalCatalog } from '../types'

interface ParaclinicalFilters {
  q?: string
  categoryId?: number
  onlyActive?: boolean
}

export function filterParaclinicals(
  paraclinicals: ParaclinicalCatalog[],
  filters: ParaclinicalFilters,
): ParaclinicalCatalog[] {
  return paraclinicals.filter((paraclinical) => {
    if (filters.onlyActive && !paraclinical.active) return false
    if (filters.categoryId && paraclinical.categoryId !== filters.categoryId)
      return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      if (!paraclinical.name.toLowerCase().includes(needle)) return false
    }
    return true
  })
}
