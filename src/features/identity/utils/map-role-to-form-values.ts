import type { Role } from '../types'
import type { RoleFormValues } from '../schemas/role-form.schema'

export function mapRoleToFormValues(role: Role): RoleFormValues {
  return {
    name: role.name,
    description: role.description ?? '',
  }
}
