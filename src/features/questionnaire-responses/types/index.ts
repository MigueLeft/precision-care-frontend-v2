export interface QuestionnaireResponse {
  id: number
  questionnaireVersionId: number
  patientId: number
  consultationId: number | null
  completed: boolean
  startAt: string
  completedAt: string | null
  // Adjuntado por el backend (join a questionnaire / version / result).
  questionnaireId: number | null
  questionnaireName: string | null
  versionNumber: number | null
  score: string | null
  interpretation: string | null
}
