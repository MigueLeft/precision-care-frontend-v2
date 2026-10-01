import type { IntakeQuestionDisplayVariant } from '@/features/intake-responses'
import type { AnswerDraft, IntakeEventEntry } from '../types'

type EventListVariant = Extract<IntakeQuestionDisplayVariant, 'surgery_list' | 'hospitalization_list'>

export function isEventListVariant(
  variant: IntakeQuestionDisplayVariant | null,
): variant is EventListVariant {
  return variant === 'surgery_list' || variant === 'hospitalization_list'
}

// La lista de cirugías/hospitalizaciones viaja como JSON en el texto de la
// respuesta (question_answer.text_value).
export function parseEventEntries(draft: AnswerDraft | undefined): IntakeEventEntry[] {
  if (draft?.kind !== 'text' || !draft.value) return []
  try {
    const parsed: unknown = JSON.parse(draft.value)
    return Array.isArray(parsed) ? (parsed as IntakeEventEntry[]) : []
  } catch {
    return []
  }
}

// Lista vacía = sin respuesta (no se envía).
export function toEventListDraft(entries: IntakeEventEntry[]): AnswerDraft {
  return { kind: 'text', value: entries.length > 0 ? JSON.stringify(entries) : '' }
}
