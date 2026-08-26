import type { ExamFormValues } from '../schemas/exam-form.schema'
import type { CreateExamPayload } from '../types'

export function mapExamFormToPayload(values: ExamFormValues): CreateExamPayload {
  return {
    name: values.name,
    category: values.category,
    valueType: values.valueType,
    defaultUnit: values.defaultUnit || undefined,
    referenceMin: values.referenceMin ? Number(values.referenceMin) : undefined,
    referenceMax: values.referenceMax ? Number(values.referenceMax) : undefined,
  }
}
