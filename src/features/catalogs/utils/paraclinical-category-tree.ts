import type { ParaclinicalCategoryCatalog } from '../types'

export interface CategoryTreeNode extends ParaclinicalCategoryCatalog {
  children: CategoryTreeNode[]
}

// Construye el árbol categoría raíz -> subcategorías a partir de la lista plana.
export function buildCategoryTree(
  categories: ParaclinicalCategoryCatalog[],
): CategoryTreeNode[] {
  const byId = new Map<number, CategoryTreeNode>(
    categories.map((category) => [category.id, { ...category, children: [] }]),
  )
  const roots: CategoryTreeNode[] = []

  for (const node of byId.values()) {
    if (node.parentId != null && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortByName = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    nodes.forEach((n) => sortByName(n.children))
  }
  sortByName(roots)

  return roots
}

export interface CategorySelectOption {
  id: number
  name: string
  depth: number
}

// Aplana el árbol para un <Select> con opciones indentadas.
export function flattenCategoryOptions(
  categories: ParaclinicalCategoryCatalog[],
): CategorySelectOption[] {
  const options: CategorySelectOption[] = []

  const walk = (nodes: CategoryTreeNode[], depth: number) => {
    for (const node of nodes) {
      options.push({ id: node.id, name: node.name, depth })
      walk(node.children, depth + 1)
    }
  }
  walk(buildCategoryTree(categories), 0)

  return options
}

// Categorías raíz (Laboratorio, Imagen…): las subcategorías van en su propio select.
export function rootCategories(categories: ParaclinicalCategoryCatalog[]) {
  return categories
    .filter((category) => category.parentId == null)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function childCategories(categories: ParaclinicalCategoryCatalog[], parentId: number) {
  return categories
    .filter((category) => category.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

// La categoría y todas sus subcategorías (para filtrar por la raíz).
export function categoryWithDescendants(
  categories: ParaclinicalCategoryCatalog[],
  id: number,
): Set<number> {
  const ids = new Set([id])
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

// Raíz de una categoría (sube por parentId).
export function rootOf(categories: ParaclinicalCategoryCatalog[], id: number): number {
  const byId = new Map(categories.map((category) => [category.id, category]))
  let current = byId.get(id)
  while (current?.parentId != null && byId.has(current.parentId)) {
    current = byId.get(current.parentId)
  }
  return current?.id ?? id
}
