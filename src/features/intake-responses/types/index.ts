export interface IntakeResponseListResult {
  mappingId: number
  name: string | null
  score: string
  interpretation: string | null
  destinationType: string
  destinationField: string | null
}

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
  // Todos los resultados del ingresable, con el nombre de cada score.
  results: IntakeResponseListResult[]
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
  /** Nombre legible del score (ej. "Calidad de sueño (SQS)"). */
  name: string | null
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

// letters_only: sin números; phone: solo dígitos y símbolos de teléfono.
export type IntakeQuestionDisplayVariant =
  | 'short_text'
  | 'select'
  | 'inline'
  | 'letters_only'
  | 'phone'

export type IntakeConditionOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'in'
  | 'not_in'

// La pregunta solo se muestra si la respuesta a `dependsOnQuestionId` cumple la
// condición. `value`: 'true'/'false' (boolean), `value` de la opción (choice),
// número (numeric); lista separada por comas para 'in' / 'not_in'.
export interface IntakeResponseDetailCondition {
  dependsOnQuestionId: number
  operator: IntakeConditionOperator
  value: string
}

export interface IntakeResponseDetailQuestion {
  id: number
  text: string
  type: IntakeResponseQuestionType
  displayVariant: IntakeQuestionDisplayVariant | null
  conditions: IntakeResponseDetailCondition[]
  options: IntakeResponseDetailQuestionOption[] | null
  answer: IntakeResponseDetailAnswer | null
}

export type IntakePatientSex = 'male' | 'female'

export interface IntakeResponseDetailGroup {
  id: number
  title: string
  /** Paso del formulario público al que pertenece (ej. "A. Datos generales"). */
  stepTitle: string | null
  /** Si se define, la sección solo aplica a pacientes de ese sexo. */
  sexRestriction: IntakePatientSex | null
  questions: IntakeResponseDetailQuestion[]
}

export interface IntakeResponseDetailPatient {
  firstName: string
  lastName: string
  sex: IntakePatientSex | null
}

export interface IntakeResponseDetail {
  id: number
  intakeName: string | null
  versionNumber: number | null
  completed: boolean
  startAt: string
  completedAt: string | null
  patient: IntakeResponseDetailPatient | null
  results: IntakeResponseDetailResult[]
  groups: IntakeResponseDetailGroup[]
}
