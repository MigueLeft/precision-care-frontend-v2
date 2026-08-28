import type { Medication } from '../types'
import type { MedicationFormValues } from '../schemas/medication-form.schema'

export function mapMedicationToFormValues(medication: Medication): MedicationFormValues {
  return {
    brandName: medication.brandName,
    genericName: medication.genericName,
    presentationId: medication.presentationId,
    concentration: medication.concentration ?? '',
    categoryId: medication.categoryId ?? undefined,
  }
}
