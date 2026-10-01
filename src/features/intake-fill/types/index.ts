import type { IntakeResponseDetailQuestion } from '@/features/intake-responses'

export type AnswerDraft =
  | { kind: 'option'; optionId: number }
  // `texts`: texto adjunto a cada opción elegida (ej. parentesco).
  | { kind: 'options'; optionIds: number[]; texts?: Record<number, string> }
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

export interface PublicCatalogItem {
  id: number
  name: string
}

export interface PublicCountry extends PublicCatalogItem {
  nationalityName: string | null
}

// Catálogos que usan los selectores del formulario público.
export interface PublicIntakeCatalogs {
  countries: PublicCountry[]
  surgeries: PublicCatalogItem[]
  hospitalizations: PublicCatalogItem[]
}

// Cirugía u hospitalización capturada por el paciente (misma información que
// se registra en la consulta).
export interface IntakeEventEntry {
  name: string
  date?: string
  complications?: string
}
