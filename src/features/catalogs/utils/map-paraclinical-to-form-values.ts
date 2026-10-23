import type { ParaclinicalCatalog } from '../types'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

export function mapParaclinicalToFormValues(
  paraclinical: ParaclinicalCatalog,
): ParaclinicalFormValues {
  return {
    name: paraclinical.name,
    categoryId: paraclinical.categoryId,
    loincCode: paraclinical.loincCode ?? '',
    description: paraclinical.description ?? '',
    defaultUnit: paraclinical.defaultUnit ?? '',
    valueType: paraclinical.valueType,
    referenceMin: paraclinical.referenceMin ?? '',
    referenceMax: paraclinical.referenceMax ?? '',
    showByDefault: paraclinical.showByDefault,
  }
}
