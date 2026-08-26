import type { ExamCatalog } from '../types'
import type { ExamFormValues } from '../schemas/exam-form.schema'

export function mapExamToFormValues(exam: ExamCatalog): ExamFormValues {
  return {
    name: exam.name,
    category: exam.category,
    defaultUnit: exam.defaultUnit ?? '',
    valueType: exam.valueType,
    referenceMin: exam.referenceMin ?? '',
    referenceMax: exam.referenceMax ?? '',
  }
}
