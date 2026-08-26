import type { Medication } from '../types'
import type { MedicationFormValues } from '../schemas/medication-form.schema'

export function mapMedicationToFormValues(medication: Medication): MedicationFormValues {
  return {
    brandName: medication.brandName,
    genericName: medication.genericName,
    presentation: medication.presentation,
    concentration: medication.concentration ?? '',
    category: medication.category ?? '',
  }
}
