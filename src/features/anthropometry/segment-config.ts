import type { AnthropometrySegmentType, SegmentInputKey } from './types'

export const SEGMENTS: AnthropometrySegmentType[] = [
  'right_arm',
  'left_arm',
  'right_leg',
  'left_leg',
  'torso',
]

export const SEGMENT_LABELS: Record<AnthropometrySegmentType, string> = {
  right_arm: 'Brazo derecho',
  left_arm: 'Brazo izquierdo',
  right_leg: 'Pierna derecha',
  left_leg: 'Pierna izquierda',
  torso: 'Tronco',
}

export interface SegmentParam {
  key: SegmentInputKey | 'skeletalMuscleMassKg'
  label: string
  unit: string
  calc?: boolean
}

// La masa muscular prevista solo se captura por segmento (no hay valor total).
export const SEGMENT_PARAMS: SegmentParam[] = [
  { key: 'fatMassPct', label: 'Masa grasa', unit: '%' },
  { key: 'fatMassKg', label: 'Masa grasa', unit: 'kg' },
  { key: 'leanMassKg', label: 'Masa magra', unit: 'kg' },
  { key: 'predictedMuscleMassKg', label: 'Masa muscular prevista', unit: 'kg' },
  { key: 'skeletalMuscleMassKg', label: 'Masa músculo esquelética', unit: 'kg', calc: true },
]
