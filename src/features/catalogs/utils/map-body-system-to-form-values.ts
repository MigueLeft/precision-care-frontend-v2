import type { BodySystem } from '../types'
import type { BodySystemFormValues } from '../schemas/body-system-form.schema'

export function mapBodySystemToFormValues(bodySystem: BodySystem): BodySystemFormValues {
  return {
    name: bodySystem.name,
    shortCode: bodySystem.shortCode,
    cie10Chapter: bodySystem.cie10Chapter ?? '',
    description: bodySystem.description ?? '',
  }
}
