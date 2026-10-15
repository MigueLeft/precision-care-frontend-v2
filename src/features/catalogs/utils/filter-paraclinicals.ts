import type { ParaclinicalCatalog } from '../types'

interface ParaclinicalFilters {
  q?: string
  // Categoría elegida con sus subcategorías (filtrar por Laboratorio incluye todas).
  categoryIds?: Set<number>
  onlyActive?: boolean
}

export function filterParaclinicals(
  paraclinicals: ParaclinicalCatalog[],
  filters: ParaclinicalFilters,
): ParaclinicalCatalog[] {
  return paraclinicals.filter((paraclinical) => {
    if (filters.onlyActive && !paraclinical.active) return false
    if (filters.categoryIds && !filters.categoryIds.has(paraclinical.categoryId)) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${paraclinical.name} ${paraclinical.loincCode ?? ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
