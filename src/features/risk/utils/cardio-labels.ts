import type {
  AnticoagulationRecommendation,
  AscvdCategory,
  Cha2ds2Item,
  PreventOutcome,
  RiskCalculation,
  RiskFactorAnswers,
} from '../types'

type ChipColor = 'success' | 'info' | 'warning' | 'error' | 'default'

export const CALCULATION_KIND_LABELS: Record<RiskCalculation['kind'], string> = {
  findrisc: 'FINDRISC',
  globorisk: 'Globorisk',
  risk_profile: 'Perfil de factores',
  prevent: 'PREVENT',
  pce: 'PCE (heredada)',
  cha2ds2_vasc: 'CHA₂DS₂-VASc',
  cha2ds2_va: 'CHA₂DS₂-VA',
}

export const PREVENT_OUTCOME_LABELS: Record<PreventOutcome, string> = {
  total_cvd: 'ECV total',
  ascvd: 'ASCVD',
  heart_failure: 'Insuficiencia cardíaca',
}

// Mismos cortes de categoría para PREVENT-ASCVD y la PCE (cada uno con su guía).
export const ASCVD_CATEGORY_LABELS: Record<AscvdCategory, string> = {
  low: 'Bajo',
  borderline: 'Limítrofe',
  intermediate: 'Intermedio',
  high: 'Alto',
}

export const ASCVD_CATEGORY_COLORS: Record<AscvdCategory, ChipColor> = {
  low: 'success',
  borderline: 'info',
  intermediate: 'warning',
  high: 'error',
}

export const RECOMMENDATION_LABELS: Record<AnticoagulationRecommendation, string> = {
  recommended: 'Anticoagulación recomendada',
  reasonable: 'Anticoagulación razonable',
  consider: 'Considerar anticoagulación',
  not_recommended: 'Anticoagulación no recomendada',
}

export const RECOMMENDATION_COLORS: Record<AnticoagulationRecommendation, ChipColor> = {
  recommended: 'error',
  reasonable: 'warning',
  consider: 'warning',
  not_recommended: 'success',
}

export const CHA2DS2_ITEM_LABELS: Record<Cha2ds2Item['item'], string> = {
  C: 'Insuficiencia cardíaca',
  H: 'Hipertensión',
  A2: 'Edad ≥75',
  D: 'Diabetes',
  S2: 'ACV / AIT / tromboembolia',
  V: 'Enfermedad vascular',
  A: 'Edad 65–74',
  Sc: 'Sexo femenino',
}

// Diagnósticos derivados de la historia (CIE-10) que el médico confirma o descarta.
export const DIAGNOSIS_QUESTIONS: { key: keyof RiskFactorAnswers; label: string }[] = [
  { key: 'atrialFibrillation', label: 'Fibrilación o flutter auricular' },
  { key: 'heartFailure', label: 'Insuficiencia cardíaca o disfunción de VI' },
  { key: 'hypertensionDx', label: 'Hipertensión arterial diagnosticada' },
  { key: 'strokeTiaThromboembolism', label: 'ACV isquémico, AIT o tromboembolia' },
  { key: 'vascularDisease', label: 'Enfermedad vascular (IAM, arterial periférica, coronaria significativa)' },
  { key: 'mitralStenosisModSevere', label: 'Estenosis mitral moderada-grave' },
  { key: 'mechanicalValve', label: 'Prótesis valvular mecánica' },
]

export const percent = (fraction: number | null, digits = 1) =>
  fraction === null ? '—' : `${(fraction * 100).toFixed(digits)} %`
