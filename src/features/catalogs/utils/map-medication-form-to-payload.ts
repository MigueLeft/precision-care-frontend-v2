import type { MedicationFormValues } from '../schemas/medication-form.schema'
import type { CreateMedicationPayload } from '../types'

export function mapMedicationFormToPayload(values: MedicationFormValues): CreateMedicationPayload {
  return {
    brandName: values.brandName,
    genericName: values.genericName,
    presentation: values.presentation,
    concentration: values.concentration || undefined,
    category: values.category || undefined,
  }
}
