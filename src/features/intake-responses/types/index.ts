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
