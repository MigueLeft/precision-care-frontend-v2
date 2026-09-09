import type { Allergy } from '../types'

// La gravedad viene del subcatálogo (texto libre); "grave"/"severa" se resalta en rojo.
export function isSevereAllergy(allergy: Allergy): boolean {
  return /grave|severa/i.test(allergy.severityName ?? '')
}

export function allergySeverityColor(
  severityName: string | null,
): 'error' | 'warning' | 'default' {
  if (!severityName) return 'default'
  return /grave|severa/i.test(severityName) ? 'error' : 'warning'
}

export function formatAllergyLabel(allergy: Allergy): string {
  const base = allergy.name ?? 'Alergia'
  return allergy.severityName ? `${base} — ${allergy.severityName.toLowerCase()}` : base
}
