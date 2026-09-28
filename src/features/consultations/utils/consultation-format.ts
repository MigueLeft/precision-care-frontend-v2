import type {
  Consultation,
  ConsultationReasonType,
  ConsultationStatus,
  DiagnosisType,
  DiseaseStatus,
  SymptomStatus,
  SymptomDiseaseLink,
  MedicationAdherence,
  MedicationRamStatus,
} from '../types'

type ChipColor = 'warning' | 'success' | 'info' | 'default' | 'error'

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
  remission: 'En remisión',
  resolved: 'Resuelta',
  discarded: 'Descartada',
  to_diagnose: 'A diagnosticar',
}

export const DISEASE_STATUS_COLORS: Record<DiseaseStatus, ChipColor> = {
  active: 'warning',
  controlled: 'success',
  remission: 'info',
  resolved: 'default',
  discarded: 'error',
  to_diagnose: 'info',
}

// Estados "vigentes" (se muestran por defecto en el expediente).
export const ACTIVE_DISEASE_STATUSES: DiseaseStatus[] = [
  'active',
  'controlled',
  'remission',
  'to_diagnose',
]

// Opciones de estado según si la enfermedad es aguda o crónica.
const ACUTE_DISEASE_STATUSES: DiseaseStatus[] = [
  'active',
  'resolved',
  'discarded',
  'to_diagnose',
]
const CHRONIC_DISEASE_STATUSES: DiseaseStatus[] = [
  'controlled',
  'remission',
  'discarded',
]

export function diseaseStatusOptions(isChronic: boolean | null): DiseaseStatus[] {
  return isChronic ? CHRONIC_DISEASE_STATUSES : ACUTE_DISEASE_STATUSES
}

// ─── Síntomas en la consulta ────────────────────────────────────────────────

export const SYMPTOM_STATUS_LABELS: Record<SymptomStatus, string> = {
  active: 'Activo',
  under_investigation: 'Bajo investigación',
  discarded: 'Descartado',
  controlled: 'Controlado',
  resolved: 'Resuelto',
}

export const SYMPTOM_STATUS_COLORS: Record<SymptomStatus, ChipColor> = {
  active: 'warning',
  under_investigation: 'info',
  discarded: 'error',
  controlled: 'success',
  resolved: 'default',
}

export const SYMPTOM_STATUSES = Object.keys(
  SYMPTOM_STATUS_LABELS,
) as SymptomStatus[]

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

// "Migraña (Bajo investigación) · HTA (Descartado)" — diagnósticos de un síntoma.
export function formatSymptomDiseases(links: SymptomDiseaseLink[]): string {
  return links
    .map((link) => `${link.name ?? '—'} (${SYMPTOM_STATUS_LABELS[link.status]})`)
    .join(' · ')
}

export const REASON_TYPE_LABELS: Record<ConsultationReasonType, string> = {
  control: 'Control',
  new: 'Nuevo',
}

// Motivo legible: "Control", "Nuevo · <texto>" o el texto libre (primera vez).
export function formatConsultationReason(
  consultation: Pick<Consultation, 'reasonType' | 'consultationReason'>,
): string {
  const text = consultation.consultationReason?.trim() ?? ''
  if (consultation.reasonType === 'control') return REASON_TYPE_LABELS.control
  if (consultation.reasonType === 'new') {
    return text ? `${REASON_TYPE_LABELS.new} · ${text}` : REASON_TYPE_LABELS.new
  }
  return text
}
