import type {
  IntakeResponseDetailCondition,
  IntakeResponseDetailGroup,
  IntakeResponseDetailQuestion,
} from '@/features/intake-responses'
import type { AnswerDraft, AnswerMap } from '../types'

export type QuestionIndex = Map<number, IntakeResponseDetailQuestion>

export function buildQuestionIndex(groups: IntakeResponseDetailGroup[]): QuestionIndex {
  const index: QuestionIndex = new Map()
  for (const group of groups) {
    for (const question of group.questions) index.set(question.id, question)
  }
  return index
}

// Respuesta de una pregunta como lista de valores comparables con
// `condition.value`: 'true'/'false' (boolean), `value` de la opción elegida
// (choice) o el texto/número capturado.
function getAnswerValues(
  question: IntakeResponseDetailQuestion,
  draft: AnswerDraft | undefined,
): string[] {
  if (!draft) return []
  const optionValue = (optionId: number) =>
    question.options?.find((option) => option.id === optionId)?.value

  switch (draft.kind) {
    case 'boolean':
      return [String(draft.value)]
    case 'option': {
      const value = optionValue(draft.optionId)
      return value ? [value] : []
    }
    case 'options':
      return draft.optionIds.flatMap((id) => optionValue(id) ?? [])
    default:
      return draft.value === '' ? [] : [draft.value]
  }
}

function evaluateCondition(condition: IntakeResponseDetailCondition, values: string[]): boolean {
  // Mientras la pregunta de la que depende no tenga respuesta, se mantiene oculta.
  if (values.length === 0) return false

  const list = condition.value.split(',').map((item) => item.trim())
  const numeric = Number(values[0])
  const threshold = Number(condition.value)

  switch (condition.operator) {
    case 'eq':
      return values.includes(condition.value)
    case 'neq':
      return !values.includes(condition.value)
    case 'in':
      return values.some((value) => list.includes(value))
    case 'not_in':
      return !values.some((value) => list.includes(value))
    case 'gt':
      return numeric > threshold
    case 'gte':
      return numeric >= threshold
    case 'lt':
      return numeric < threshold
    case 'lte':
      return numeric <= threshold
  }
}

// Una pregunta con condiciones se oculta si alguna no se cumple, o si la
// pregunta de la que depende está a su vez oculta.
export function isQuestionVisible(
  question: IntakeResponseDetailQuestion,
  index: QuestionIndex,
  answers: AnswerMap,
  visiting: ReadonlySet<number> = new Set(),
): boolean {
  if (question.conditions.length === 0) return true
  if (visiting.has(question.id)) return false

  const nextVisiting = new Set(visiting).add(question.id)
  return question.conditions.every((condition) => {
    const dependency = index.get(condition.dependsOnQuestionId)
    if (!dependency || !isQuestionVisible(dependency, index, answers, nextVisiting)) return false
    return evaluateCondition(condition, getAnswerValues(dependency, answers[dependency.id]))
  })
}
