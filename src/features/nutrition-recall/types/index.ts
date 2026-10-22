// Recordatorio de 24 Horas (NutriBot). Refleja las respuestas del módulo
// nutrition-recalls del backend.

export type NutritionRecallReportStatus = 'sent' | 'backup' | 'failed'

export interface NutritionRecall {
  id: number
  patientId: number
  completed: boolean
  startAt: string
  completedAt: string | null
  reportStatus: NutritionRecallReportStatus | null
  sendReportToPatient: boolean
  sendReportToDoctor: boolean
  // Solo mientras está pendiente.
  link: string | null
}

export interface NutritionRecallDetail extends NutritionRecall {
  reportMarkdown: string | null
  reportError: string | null
}

export interface SendNutritionRecallDto {
  patientId: number
  sendReportToPatient: boolean
  sendReportToDoctor: boolean
}

export interface SendNutritionRecallResult {
  recall: NutritionRecall
  link: string
  // true si además se envió por correo.
  sent: boolean
}

export interface PublicNutritionRecall {
  firstName: string
  completed: boolean
  sendReportToPatient: boolean
  sendReportToDoctor: boolean
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}
