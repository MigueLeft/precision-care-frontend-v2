import type { BodySystemFormValues } from '../schemas/body-system-form.schema'
import type { BodySystemPayload } from '../services/catalogs.service'

export function mapBodySystemFormToPayload(values: BodySystemFormValues): BodySystemPayload {
  return {
    name: values.name,
    shortCode: values.shortCode,
    cie10Chapter: values.cie10Chapter || undefined,
    description: values.description || undefined,
  }
}
