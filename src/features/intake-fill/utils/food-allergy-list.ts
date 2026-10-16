import type { AnswerDraft } from '../types'

// Alergias alimentarias del paciente: JSON `[{ name }]` en el texto de la
// respuesta (question_answer.text_value). Las que no están en el catálogo se
// agregan a él al completar el formulario (backend).
export function parseFoodAllergyNames(draft: AnswerDraft | undefined): string[] {
  if (draft?.kind !== 'text' || !draft.value) return []
  try {
    const parsed: unknown = JSON.parse(draft.value)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item: unknown) =>
      typeof item === 'object' && item !== null && typeof (item as { name?: unknown }).name === 'string'
        ? [(item as { name: string }).name]
        : [],
    )
  } catch {
    return []
  }
}

// Sin repetidos (sin distinguir mayúsculas); lista vacía = sin respuesta.
export function toFoodAllergyDraft(names: string[]): AnswerDraft {
  const seen = new Set<string>()
  const unique = names.filter((name) => {
    const key = name.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
  return {
    kind: 'text',
    value: unique.length > 0 ? JSON.stringify(unique.map((name) => ({ name: name.trim() }))) : '',
  }
}
