import type { StatTileTone } from '@/components/ui/StatTile'

export { formatShortDate } from '@/utils/format-date'

// Clasificación de IMC (OMS).
export function bmiTone(bmi: number | null): StatTileTone {
  if (bmi === null) return 'neutral'
  if (bmi < 18.5) return 'warning'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'warning'
  return 'danger'
}

export function bmiLabel(bmi: number | null): string {
  if (bmi === null) return ''
  if (bmi < 18.5) return 'Bajo peso'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidad'
}

// Presión arterial: normal <130/85, elevada <140/90, alta el resto.
export function bloodPressureTone(
  systolic: number | null,
  diastolic: number | null,
): StatTileTone {
  if (systolic === null || diastolic === null) return 'neutral'
  if (systolic < 130 && diastolic < 85) return 'normal'
  if (systolic < 140 && diastolic < 90) return 'warning'
  return 'danger'
}

export function bloodPressureLabel(
  systolic: number | null,
  diastolic: number | null,
): string {
  const tone = bloodPressureTone(systolic, diastolic)
  if (tone === 'normal') return 'Normal'
  if (tone === 'warning') return 'Elevada'
  if (tone === 'danger') return 'Alta'
  return ''
}
