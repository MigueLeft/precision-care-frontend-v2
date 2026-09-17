export interface IntakeResponse {
  id: number
  intakeVersionId: number
  patientId: number
  consultationId: number | null
  completed: boolean
  startAt: string
  completedAt: string | null
  // Adjuntado por el backend (join a intake / version / result).
  intakeId: number | null
  intakeName: string | null
  versionNumber: number | null
  score: string | null
  interpretation: string | null
}

export type IntakeResponseQuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'scale'
  | 'free_text'
  | 'numeric'
  | 'date'
  | 'boolean'

export interface IntakeResponseDetailResult {
  mappingId: number
  score: string
  interpretation: string | null
  destinationType: string
  destinationField: string | null
}

export interface IntakeResponseDetailQuestionOption {
  id: number
  text: string
  value: string
}

export interface IntakeResponseDetailAnswer {
  text: string | null
  selectedOptionIds: number[]
}

export interface IntakeResponseDetailQuestion {
  id: number
  text: string
  type: IntakeResponseQuestionType
  options: IntakeResponseDetailQuestionOption[] | null
  answer: IntakeResponseDetailAnswer | null
}

export interface IntakeResponseDetailGroup {
  id: number
  title: string
  questions: IntakeResponseDetailQuestion[]
}

export interface IntakeResponseDetail {
  id: number
  intakeName: string | null
  versionNumber: number | null
  completed: boolean
  startAt: string
  completedAt: string | null
  results: IntakeResponseDetailResult[]
  groups: IntakeResponseDetailGroup[]
}
