import type { BodyComposition, BodyCompositionSegment, BodySegment } from '../types'

export const BODY_SEGMENT_LABELS: Record<BodySegment, string> = {
  total: 'Total',
  torso: 'Torso',
  left_arm: 'Brazo izq.',
  right_arm: 'Brazo der.',
  left_leg: 'Pierna izq.',
  right_leg: 'Pierna der.',
}

// Medición más reciente (el backend ya ordena desc por fecha de evaluación).
export function getLatestBodyComposition(
  compositions: BodyComposition[],
): BodyComposition | undefined {
  return compositions[0]
}

export function getSegment(
  composition: BodyComposition | undefined,
  segment: BodySegment,
): BodyCompositionSegment | undefined {
  return composition?.segments.find((s) => s.segment === segment)
}
