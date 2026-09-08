import type { ConsultationStatus, DiagnosisType } from '../types'

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  in_progress: 'En curso',
  completed: 'Completada',
}

export const DIAGNOSIS_TYPE_LABELS: Record<DiagnosisType, string> = {
  primary: 'Primario',
  secondary: 'Secundario',
  presumptive: 'Presuntivo',
  definitive: 'Definitivo',
  discarded: 'Descartado',
}
