import type { RoleFormValues } from '../schemas/role-form.schema'
import type { CreateRolePayload } from '../types'

export function mapRoleFormToPayload(values: RoleFormValues): CreateRolePayload {
  return {
    name: values.name,
    description: values.description || undefined,
  }
}
