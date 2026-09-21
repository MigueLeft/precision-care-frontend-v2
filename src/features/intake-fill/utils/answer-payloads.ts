import type { PublicAnswerPayload } from '../services/intake-fill.service'
import type { AnswerDraft, AnswerMap } from '../types'
import type { IntakeStep } from './intake-steps'
import { isQuestionVisible, type QuestionIndex } from './question-visibility'

function draftToPayloads(questionId: number, draft: AnswerDraft): PublicAnswerPayload[] {
  switch (draft.kind) {
    case 'option':
      return [{ questionId, optionId: draft.optionId }]
    case 'options':
      return draft.optionIds.map((optionId) => ({ questionId, optionId }))
    case 'text':
      return draft.value.trim() ? [{ questionId, textValue: draft.value.trim() }] : []
    case 'numeric': {
      const numeric = Number(draft.value)
      return draft.value !== '' && !Number.isNaN(numeric)
        ? [{ questionId, numericValue: numeric }]
        : []
    }
    case 'date':
      return draft.value ? [{ questionId, dateValue: draft.value }] : []
    case 'boolean':
      return [{ questionId, booleanValue: draft.value }]
  }
}

// Solo se envían las respuestas de preguntas visibles: si el paciente cambió
// una respuesta y una pregunta dependiente quedó oculta, su valor viejo se descarta.
export function collectPayloads(
  steps: IntakeStep[],
  index: QuestionIndex,
  answers: AnswerMap,
): PublicAnswerPayload[] {
  return steps
    .flatMap((step) => step.groups)
    .flatMap((group) => group.questions)
    .filter((question) => isQuestionVisible(question, index, answers))
    .flatMap((question) => {
      const draft = answers[question.id]
      return draft ? draftToPayloads(question.id, draft) : []
    })
}
