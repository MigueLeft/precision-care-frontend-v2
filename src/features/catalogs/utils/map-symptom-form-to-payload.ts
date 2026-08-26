import type { SymptomFormValues } from '../schemas/symptom-form.schema'
import type { CreateSymptomPayload } from '../types'

export function mapSymptomFormToPayload(values: SymptomFormValues): CreateSymptomPayload {
  return {
    name: values.name,
    cie10Code: values.cie10Code || undefined,
    bodySystemId: values.bodySystemId,
  }
}
