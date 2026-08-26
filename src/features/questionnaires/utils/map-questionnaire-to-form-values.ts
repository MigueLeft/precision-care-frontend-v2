import type { Questionnaire } from '../types'
import type { QuestionnaireFormValues } from '../schemas/questionnaire-form.schema'

export function mapQuestionnaireToFormValues(questionnaire: Questionnaire): QuestionnaireFormValues {
  return {
    name: questionnaire.name,
    description: questionnaire.description ?? '',
    type: questionnaire.type,
  }
}
