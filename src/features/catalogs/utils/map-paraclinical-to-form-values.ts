import type { ParaclinicalCatalog } from '../types'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

export function mapParaclinicalToFormValues(
  paraclinical: ParaclinicalCatalog,
): ParaclinicalFormValues {
  return {
    name: paraclinical.name,
    categoryId: paraclinical.categoryId,
    defaultUnit: paraclinical.defaultUnit ?? '',
    valueType: paraclinical.valueType,
    referenceMin: paraclinical.referenceMin ?? '',
    referenceMax: paraclinical.referenceMax ?? '',
  }
}
