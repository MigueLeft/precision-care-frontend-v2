import type { SymptomCatalog } from '../types'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

export function mapSymptomToFormValues(symptom: SymptomCatalog): SymptomFormValues {
  return {
    name: symptom.name,
  }
}
