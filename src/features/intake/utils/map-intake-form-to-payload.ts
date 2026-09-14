import type { IntakeFormValues } from '../schemas/intake-form.schema'
import type { CreateIntakePayload } from '../types'

export function mapIntakeFormToPayload(
  values: IntakeFormValues,
): CreateIntakePayload {
  return {
    name: values.name,
    description: values.description || undefined,
    type: values.type,
  }
}
