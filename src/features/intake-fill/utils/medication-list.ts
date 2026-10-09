import type { IntakeResponseDetailQuestionOption } from '@/features/intake-responses'
import type { AnswerDraft, IntakeMedicationEntry } from '../types'

// `value` de la opción "Otro (no está en la lista)": el medicamento real se
// captura en la pregunta `medication_list` que depende de ella.
const OTHER_OPTION_VALUE = 'otro_no_esta_en_la_lista'

export function isOtherMedicationOption(option: IntakeResponseDetailQuestionOption): boolean {
  return option.value === OTHER_OPTION_VALUE
}

// Medicamentos escritos a mano: JSON `{ name, frequency? }` en el texto de la
// respuesta (question_answer.text_value).
export function parseMedicationEntries(draft: AnswerDraft | undefined): IntakeMedicationEntry[] {
  if (draft?.kind !== 'text' || !draft.value) return []
  try {
    const parsed: unknown = JSON.parse(draft.value)
    return Array.isArray(parsed) ? (parsed as IntakeMedicationEntry[]) : []
  } catch {
    return []
  }
}

// Lista vacía = sin respuesta (no se envía).
export function toMedicationListDraft(entries: IntakeMedicationEntry[]): AnswerDraft {
  return { kind: 'text', value: entries.length > 0 ? JSON.stringify(entries) : '' }
}
