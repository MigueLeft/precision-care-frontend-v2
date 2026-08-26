export type QuestionnaireType = 'lifestyle' | 'psychometric' | 'antecedents' | 'other'

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'scale'
  | 'free_text'
  | 'numeric'
  | 'date'
  | 'boolean'

export type ScoringType = 'sum' | 'weighted_sum' | 'range_lookup' | 'custom_function'

export type MappingDestinationType =
  | 'patient_field'
  | 'lifestyle'
  | 'antecedent'
  | 'allergy'
  | 'body_composition'
  | 'custom'

export interface Questionnaire {
  id: number
  name: string
  description: string | null
  type: QuestionnaireType
  currentVersionId: number | null
  active: boolean
}

export interface QuestionnaireVersion {
  id: number
  questionnaireId: number
  versionNumber: number
  publishedAt: string | null
  active: boolean
}

export interface QuestionOption {
  id: number
  questionId: number
  sortOrder: number
  text: string
  value: string
  score: string
}

export interface Question {
  id: number
  questionnaireVersionId: number
  groupId: number | null
  sortOrder: number
  text: string
  type: QuestionType
  required: boolean
  options: QuestionOption[]
}

export interface QuestionGroup {
  id: number
  questionnaireVersionId: number
  sortOrder: number
  title: string
  description: string | null
  lifestyleComponent: string | null
  questions: Question[]
}

export interface RangeInterpretation {
  id: number
  questionnaireMappingId: number
  minScore: string
  maxScore: string
  interpretation: string
  color: string | null
}

export interface QuestionnaireMapping {
  id: number
  questionnaireVersionId: number
  groupId: number | null
  questionId: number | null
  scoringType: ScoringType
  parameters: Record<string, unknown> | null
  destinationType: MappingDestinationType
  destinationTable: string | null
  destinationField: string | null
  handlerName: string | null
  interpretations: RangeInterpretation[]
}

export interface QuestionnaireVersionDetailed extends QuestionnaireVersion {
  groups: QuestionGroup[]
  ungroupedQuestions: Question[]
  mappings: QuestionnaireMapping[]
}

export interface QuestionnaireDetailed extends Questionnaire {
  version: QuestionnaireVersionDetailed | null
}

export interface CreateQuestionnairePayload {
  name: string
  description?: string
  type: QuestionnaireType
}
export type UpdateQuestionnairePayload = Partial<CreateQuestionnairePayload>

export interface CreateSectionPayload {
  sortOrder: number
  title: string
  description?: string
  lifestyleComponent?: string
}
export type UpdateSectionPayload = Partial<CreateSectionPayload>

export interface CreateQuestionPayload {
  groupId?: number
  sortOrder: number
  text: string
  type: QuestionType
  required: boolean
}
export type UpdateQuestionPayload = Partial<CreateQuestionPayload>

export interface CreateOptionPayload {
  sortOrder: number
  text: string
  value: string
  score: number
}
export type UpdateOptionPayload = Partial<CreateOptionPayload>

export interface CreateMappingPayload {
  groupId?: number
  questionId?: number
  scoringType: ScoringType
  parameters?: Record<string, unknown>
  destinationType: MappingDestinationType
  destinationTable?: string
  destinationField?: string
  handlerName?: string
}
export type UpdateMappingPayload = Partial<CreateMappingPayload>

export interface CreateRangeInterpretationPayload {
  minScore: number
  maxScore: number
  interpretation: string
  color?: string
}
export type UpdateRangeInterpretationPayload = Partial<CreateRangeInterpretationPayload>
