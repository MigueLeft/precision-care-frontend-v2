import { MODULE_ORDER } from './module-labels'
import type { Permission, PermissionAction, Role } from '../types'

export const MATRIX_ACTIONS: PermissionAction[] = ['create', 'read', 'update', 'delete']

export type PermissionMatrix = Record<string, boolean>

function matrixKey(module: string, action: PermissionAction): string {
  return `${module}:${action}`
}

export function getOrderedModules(permissions: Permission[]): string[] {
  const availableModules = new Set(permissions.map((p) => p.module))
  const ordered = MODULE_ORDER.filter((module) => availableModules.has(module))
  const extra = Array.from(availableModules).filter((module) => !MODULE_ORDER.includes(module))
  return [...ordered, ...extra]
}

export function findPermission(
  permissions: Permission[],
  module: string,
  action: PermissionAction,
): Permission | undefined {
  return permissions.find((p) => p.module === module && p.action === action)
}

export function buildInitialMatrix(role: Role, permissions: Permission[]): PermissionMatrix {
  const assignedIds = new Set(role.permissions.map((p) => p.id))
  const modules = getOrderedModules(permissions)
  const matrix: PermissionMatrix = {}

  for (const module of modules) {
    for (const action of MATRIX_ACTIONS) {
      const permission = findPermission(permissions, module, action)
      matrix[matrixKey(module, action)] = !!permission && assignedIds.has(permission.id)
    }
  }

  return matrix
}

export function computePermissionIds(matrix: PermissionMatrix, permissions: Permission[]): number[] {
  const modules = getOrderedModules(permissions)
  const ids: number[] = []

  for (const module of modules) {
    for (const action of MATRIX_ACTIONS) {
      if (!matrix[matrixKey(module, action)]) continue
      const permission = findPermission(permissions, module, action)
      if (permission) ids.push(permission.id)
    }
  }

  return ids
}

export { matrixKey }
