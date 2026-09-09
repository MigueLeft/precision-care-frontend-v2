import type {
  ConsultationStatus,
  DiagnosisType,
  DiseaseStatus,
  MedicationAdherence,
  MedicationRamStatus,
} from '../types'

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

export const ADHERENCE_LABELS: Record<MedicationAdherence, string> = {
  good: 'Buena',
  partial: 'Parcial',
  poor: 'Mala',
}

export const ADHERENCE_COLORS: Record<
  MedicationAdherence,
  'success' | 'warning' | 'error'
> = {
  good: 'success',
  partial: 'warning',
  poor: 'error',
}

export const RAM_LABELS: Record<MedicationRamStatus, string> = {
  none: 'No',
  suspected: 'Sospecha',
  confirmed: 'Confirmada',
}

export const RAM_COLORS: Record<
  MedicationRamStatus,
  'success' | 'warning' | 'error'
> = {
  none: 'success',
  suspected: 'warning',
  confirmed: 'error',
}
