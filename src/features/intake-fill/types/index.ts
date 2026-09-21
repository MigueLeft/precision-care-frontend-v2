import type { IntakeResponseDetailQuestion } from '@/features/intake-responses'

export type AnswerDraft =
  | { kind: 'option'; optionId: number }
  | { kind: 'options'; optionIds: number[] }
  | { kind: 'text'; value: string }
  | { kind: 'numeric'; value: string }
  | { kind: 'date'; value: string }
  | { kind: 'boolean'; value: boolean }

export type AnswerMap = Record<number, AnswerDraft>

export type QuestionFieldProps = {
  question: IntakeResponseDetailQuestion
  value: AnswerDraft | undefined
  onChange: (value: AnswerDraft) => void
}
