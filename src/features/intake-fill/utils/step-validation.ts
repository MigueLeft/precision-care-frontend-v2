import type { IntakeResponseDetailQuestion } from '@/features/intake-responses'
import type { AnswerDraft, AnswerMap } from '../types'
import { isEventListVariant, parseEventEntries } from './event-list'
import { isNoneOption, splitRelationships } from './family-relationship'
import { parseMedicationEntries } from './medication-list'
import type { IntakeStep } from './intake-steps'
import { isQuestionVisible, type QuestionIndex } from './question-visibility'

const EMPTY_LIST_MESSAGES = {
  surgery_list: 'Agrega al menos una cirugía o responde "No" a la pregunta anterior.',
  hospitalization_list:
    'Agrega al menos una hospitalización o responde "No" a la pregunta anterior.',
}

function validateQuestion(
  question: IntakeResponseDetailQuestion,
  draft: AnswerDraft | undefined,
): string | null {
  if (question.displayVariant === 'family_relationship' && draft?.kind === 'options') {
    const missing = (question.options ?? []).some(
      (option) =>
        draft.optionIds.includes(option.id) &&
        !isNoneOption(option) &&
        splitRelationships(draft.texts?.[option.id]).length === 0,
    )
    return missing ? 'Indica el parentesco de cada antecedente familiar seleccionado.' : null
  }

  // La lista solo es visible si el paciente respondió "Sí" a la pregunta previa.
  if (isEventListVariant(question.displayVariant) && parseEventEntries(draft).length === 0) {
    return EMPTY_LIST_MESSAGES[question.displayVariant]
  }

  // Solo visible si el paciente eligió "Otro (no está en la lista)".
  if (question.displayVariant === 'medication_list' && parseMedicationEntries(draft).length === 0) {
    return 'Agrega el medicamento que no está en la lista con el botón "Añadir".'
  }

  return null
}

// Primer problema del paso (o null): solo se validan las preguntas visibles.
export function validateStep(
  step: IntakeStep,
  index: QuestionIndex,
  answers: AnswerMap,
): string | null {
  for (const group of step.groups) {
    for (const question of group.questions) {
      if (!isQuestionVisible(question, index, answers)) continue
      const error = validateQuestion(question, answers[question.id])
      if (error) return error
    }
  }
  return null
}
