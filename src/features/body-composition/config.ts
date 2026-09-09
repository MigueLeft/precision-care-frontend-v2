import type { BodySegment } from './types'

// Segmentos que se capturan por parte del cuerpo (sin "total").
export const SEGMENTS: BodySegment[] = [
  'right_arm',
  'left_arm',
  'right_leg',
  'left_leg',
  'torso',
]

export const SEGMENT_LABELS: Record<BodySegment, string> = {
  total: 'Total',
  torso: 'Tronco',
  left_arm: 'Brazo izquierdo',
  right_arm: 'Brazo derecho',
  left_leg: 'Pierna izquierda',
  right_leg: 'Pierna derecha',
}

// Datos generales / totales de la medición (historial tipo hoja de cálculo).
export interface GeneralParam {
  key: string
  label: string
  unit: string
  calc?: boolean
}

export const GENERAL_PARAMS: GeneralParam[] = [
  { key: 'heightCm', label: 'Altura', unit: 'cm' },
  { key: 'weightKg', label: 'Peso', unit: 'kg' },
  { key: 'bmi', label: 'IMC', unit: 'kg/m²', calc: true },
  { key: 'basalMetabolismKcal', label: 'MB / Metabolismo basal', unit: 'kcal' },
  { key: 'totalFatPct', label: 'Masa grasa', unit: '%' },
  { key: 'totalFatKg', label: 'Masa grasa', unit: 'kg', calc: true },
  { key: 'totalLeanKg', label: 'Masa magra', unit: 'kg', calc: true },
  { key: 'totalWaterKg', label: 'Agua total', unit: 'kg' },
]

// Parámetros del bloque "Composición por segmento".
export interface SegmentParam {
  key: string
  label: string
  unit: string
  calc?: boolean
}

export const SEGMENT_PARAMS: SegmentParam[] = [
  { key: 'fatMassPct', label: 'Masa grasa', unit: '%' },
  { key: 'fatMassKg', label: 'Masa grasa', unit: 'kg' },
  { key: 'leanMassKg', label: 'Masa magra', unit: 'kg' },
  { key: 'predictedMuscleMassKg', label: 'Masa músculo prevista', unit: 'kg' },
  { key: 'skeletalMuscleMassPct', label: 'Masa músculo esquelética', unit: '%' },
  {
    key: 'skeletalMuscleMassKg',
    label: 'Masa músculo esquelética',
    unit: 'kg',
    calc: true,
  },
]

const round = (n: number, d = 2) => Number(n.toFixed(d))

// Masa músculo esquelética (kg) = 0.566 * masa magra (kg) del segmento.
export function segmentSkeletalKg(leanKg: number | undefined): number | undefined {
  return leanKg !== undefined ? round(0.566 * leanKg) : undefined
}

export function computeBmi(
  weightKg: number | undefined,
  heightCm: number | undefined,
): number | undefined {
  return weightKg && heightCm ? round(weightKg / (heightCm / 100) ** 2, 1) : undefined
}

// Grasa a perder = masa grasa total (kg) − masa grasa ideal (kg).
export function fatToLose(
  totalFatKg: number | undefined,
  idealFatKg: number | undefined,
): number | undefined {
  return totalFatKg !== undefined && idealFatKg !== undefined
    ? round(totalFatKg - idealFatKg, 1)
    : undefined
}
