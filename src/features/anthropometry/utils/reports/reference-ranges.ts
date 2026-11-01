import type { Sex } from './body-silhouettes'

// Rangos de referencia de los reportes. Orientativos (OMS / EWGSOP2); los que
// dependen del sexo solo se muestran si el paciente lo tiene registrado.

export interface Range {
  min?: number
  max?: number
  // Texto de la referencia ("18.5–24.9", "< 80", "≥ 95").
  label: string
}

export type RangeStatus = 'low' | 'normal' | 'high'

const between = (min: number, max: number, decimals = 1): Range => ({
  min,
  max,
  label: `${min.toFixed(decimals)}–${max.toFixed(decimals)}`,
})
const below = (max: number): Range => ({ max, label: `< ${max}` })
const atLeast = (min: number): Range => ({ min, label: `≥ ${min}` })

// "< X" excluye el límite (X ya es alto); "a–b" lo incluye.
export function statusOf(value: number, range: Range): RangeStatus {
  if (range.min !== undefined && value < range.min) return 'low'
  if (range.max === undefined) return 'normal'
  const onlyUpper = range.min === undefined
  return (onlyUpper ? value >= range.max : value > range.max) ? 'high' : 'normal'
}

export const BMI_RANGE = between(18.5, 24.9)

// Peso saludable para la talla: IMC 18.5–24.9.
export function healthyWeightRange(heightCm: number | null): Range | null {
  if (!heightCm) return null
  const m2 = (heightCm / 100) ** 2
  return between(18.5 * m2, 24.9 * m2)
}

export function sexRanges(sex: Sex | null) {
  if (!sex) return { waist: null, waistHip: null, neck: null, fatPct: null, grip: null }
  const male = sex === 'male'
  return {
    waist: below(male ? 94 : 80),
    waistHip: below(male ? 0.9 : 0.85),
    neck: below(male ? 37 : 34.5),
    fatPct: male ? between(10, 20, 0) : between(18, 28, 0),
    // Fuerza de prensión mínima por mano (EWGSOP2).
    grip: atLeast(male ? 27 : 16),
  }
}

export const VITAL_RANGES = {
  systolic: below(120),
  diastolic: below(80),
  heartRate: between(60, 100, 0),
  oxygenSaturation: atLeast(95),
}
