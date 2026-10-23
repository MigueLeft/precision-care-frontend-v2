import type { ParaclinicalCatalog, ParaclinicalCategoryCatalog } from '../types'

export interface LabStudyOption {
  id: number
  name: string
  loincCode: string | null
  // Subcategoría de laboratorio (agrupa la lista del buscador).
  group: string
}

const LAB_ROOT_NAME = 'laboratorio'

// Ids de la categoría raíz "Laboratorio" y de todas sus subcategorías.
function labCategoryIds(categories: ParaclinicalCategoryCatalog[]): Set<number> {
  const ids = new Set(
    categories
      .filter((c) => c.parentId == null && c.name.trim().toLowerCase() === LAB_ROOT_NAME)
      .map((c) => c.id),
  )
  let grew = true
  while (grew) {
    grew = false
    for (const category of categories) {
      if (category.parentId != null && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id)
        grew = true
      }
    }
  }
  return ids
}

// Subcategorías activas de "Laboratorio" en el orden en que se crearon.
export function labSubcategories(
  categories: ParaclinicalCategoryCatalog[],
): ParaclinicalCategoryCatalog[] {
  const root = categories.find(
    (c) => c.parentId == null && c.name.trim().toLowerCase() === LAB_ROOT_NAME,
  )
  if (!root) return []
  return categories
    .filter((c) => c.parentId === root.id && c.active)
    .sort((a, b) => a.id - b.id)
}

// Estudios de laboratorio que se pueden agregar a un perfil: los activos más los
// que ya están en el perfil (aunque se hayan desactivado después).
export function labStudyOptions(
  paraclinicals: ParaclinicalCatalog[],
  categories: ParaclinicalCategoryCatalog[],
  selectedIds: number[] = [],
): LabStudyOption[] {
  const labIds = labCategoryIds(categories)
  const categoryName = new Map(categories.map((c) => [c.id, c.name]))
  return paraclinicals
    .filter((p) => labIds.has(p.categoryId) && (p.active || selectedIds.includes(p.id)))
    .map((p) => ({
      id: p.id,
      name: p.name,
      loincCode: p.loincCode,
      group: categoryName.get(p.categoryId) ?? 'Laboratorio',
    }))
    .sort((a, b) => a.group.localeCompare(b.group, 'es'))
}
