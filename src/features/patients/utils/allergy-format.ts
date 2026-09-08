import type { Allergy, AllergyType, AllergySeverity } from '../types'

export const ALLERGY_TYPE_LABELS: Record<AllergyType, string> = {
  food: 'Alimentaria',
  medication: 'Medicamento',
  environmental: 'Ambiental',
  other: 'Otra',
}

export const ALLERGY_SEVERITY_LABELS: Record<AllergySeverity, string> = {
  mild: 'Leve',
  moderate: 'Moderada',
  severe: 'Severa',
}

export const ALLERGY_SEVERITY_COLORS: Record<
  AllergySeverity,
  'warning' | 'error'
> = {
  mild: 'warning',
  moderate: 'warning',
  severe: 'error',
}

export function formatAllergyLabel(allergy: Allergy): string {
  return `${ALLERGY_TYPE_LABELS[allergy.type]}: ${allergy.description}`
}
