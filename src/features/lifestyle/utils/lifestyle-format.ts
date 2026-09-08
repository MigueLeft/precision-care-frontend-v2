import type { LifestyleComponentType } from '../types'

export const LIFESTYLE_COMPONENT_LABELS: Record<LifestyleComponentType, string> = {
  diet: 'Dieta',
  physical_activity: 'Actividad física',
  nicotine: 'Exposición a nicotina',
  sleep: 'Sueño',
  bmi: 'IMC',
  lipids: 'Lípidos',
  glucose: 'Glucosa',
  blood_pressure: 'Presión arterial',
}

// Orden de despliegue de las 8 tarjetas.
export const LIFESTYLE_COMPONENT_ORDER: LifestyleComponentType[] = [
  'diet',
  'physical_activity',
  'nicotine',
  'sleep',
  'bmi',
  'lipids',
  'glucose',
  'blood_pressure',
]

// Extrae una descripción legible del rawValue del componente (si la trae).
export function formatComponentDetail(
  rawValue: Record<string, unknown> | null,
): string | undefined {
  if (!rawValue) return undefined
  const note = rawValue.note ?? rawValue.description ?? rawValue.detail
  return typeof note === 'string' ? note : undefined
}
