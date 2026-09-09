import type { ConsultationStatus, DiagnosisType, DiseaseStatus } from '../types'

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  in_progress: 'En curso',
  completed: 'Terminada',
}

export const DIAGNOSIS_TYPE_LABELS: Record<DiagnosisType, string> = {
  primary: 'Primario',
  secondary: 'Secundario',
  presumptive: 'Presuntivo',
  definitive: 'Definitivo',
  discarded: 'Descartado',
}

export const DISEASE_STATUS_LABELS: Record<DiseaseStatus, string> = {
  active: 'Activa',
  controlled: 'Controlada',
  resolved: 'Resuelta',
  discarded: 'Descartada',
}

export const DISEASE_STATUS_COLORS: Record<
  DiseaseStatus,
  'warning' | 'success' | 'default' | 'error'
> = {
  active: 'warning',
  controlled: 'success',
  resolved: 'default',
  discarded: 'error',
}
