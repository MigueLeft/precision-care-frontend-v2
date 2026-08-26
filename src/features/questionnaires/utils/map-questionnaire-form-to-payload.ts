import type { QuestionnaireFormValues } from '../schemas/questionnaire-form.schema'
import type { CreateQuestionnairePayload } from '../types'

export function mapQuestionnaireFormToPayload(
  values: QuestionnaireFormValues,
): CreateQuestionnairePayload {
  return {
    name: values.name,
    description: values.description || undefined,
    type: values.type,
  }
}
