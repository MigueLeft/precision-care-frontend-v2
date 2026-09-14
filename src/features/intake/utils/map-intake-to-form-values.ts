import type { Intake } from '../types'
import type { IntakeFormValues } from '../schemas/intake-form.schema'

export function mapIntakeToFormValues(intake: Intake): IntakeFormValues {
  return {
    name: intake.name,
    description: intake.description ?? '',
    type: intake.type,
  }
}
