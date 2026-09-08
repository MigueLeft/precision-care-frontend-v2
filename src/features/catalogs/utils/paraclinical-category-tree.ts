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
