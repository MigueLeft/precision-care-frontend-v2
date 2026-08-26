import type { Question } from '../types'
import type { QuestionFormValues } from '../schemas/question-form.schema'

export function mapQuestionToFormValues(question: Question): QuestionFormValues {
  return {
    text: question.text,
    type: question.type,
    required: question.required,
    options: question.options.map((option) => ({
      text: option.text,
      value: option.value,
      score: Number(option.score),
    })),
  }
}
