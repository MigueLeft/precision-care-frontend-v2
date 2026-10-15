import type { Allergy } from '../types'

// La severidad viene del subcatálogo (texto libre); "severo"/"severa" (o el
// antiguo "grave") se resalta en rojo.
export function isSevereAllergy(allergy: Allergy): boolean {
  return /sever[oa]|grave/i.test(allergy.severityName ?? '')
}

export function allergySeverityColor(
  severityName: string | null,
): 'error' | 'warning' | 'default' {
  if (!severityName) return 'default'
  return /sever[oa]|grave/i.test(severityName) ? 'error' : 'warning'
}

export function formatAllergyLabel(allergy: Allergy): string {
  const base = allergy.name ?? 'Alergia'
  return allergy.severityName ? `${base} — ${allergy.severityName.toLowerCase()}` : base
}
