import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'
import type { CreateParaclinicalPayload } from '../types'

export function mapParaclinicalFormToPayload(
  values: ParaclinicalFormValues,
): CreateParaclinicalPayload {
  return {
    name: values.name,
    categoryId: values.categoryId,
    valueType: values.valueType,
    defaultUnit: values.defaultUnit || undefined,
    referenceMin: values.referenceMin ? Number(values.referenceMin) : undefined,
    referenceMax: values.referenceMax ? Number(values.referenceMax) : undefined,
  }
}
