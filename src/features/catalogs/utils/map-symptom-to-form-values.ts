import type { SymptomCatalog } from '../types'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

export function mapSymptomToFormValues(symptom: SymptomCatalog): SymptomFormValues {
  return {
    name: symptom.name,
    cie10Code: symptom.cie10Code ?? '',
    bodySystemId: symptom.bodySystemId ?? undefined,
  }
}
