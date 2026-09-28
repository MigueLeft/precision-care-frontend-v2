import { segmentSkeletalKg } from '../config'
import { toNumber } from '@/utils/parse-numeric'
import type { BodyComposition, BodyCompositionSegment, BodySegment } from '../types'

export const BODY_SEGMENT_LABELS: Record<BodySegment, string> = {
  total: 'Total',
  torso: 'Torso',
  left_arm: 'Brazo izq.',
  right_arm: 'Brazo der.',
  left_leg: 'Pierna izq.',
  right_leg: 'Pierna der.',
}

// De la más reciente a la más antigua; a igual fecha, la última registrada primero.
export function sortBodyCompositions(compositions: BodyComposition[]): BodyComposition[] {
  return [...compositions].sort(
    (a, b) => b.assessmentDate.localeCompare(a.assessmentDate) || b.id - a.id,
  )
}

// Medición más reciente.
export function getLatestBodyComposition(
  compositions: BodyComposition[],
): BodyComposition | undefined {
  return sortBodyCompositions(compositions)[0]
}

// Masa muscular esquelética del segmento; si no se guardó, se calcula de la masa magra.
export function skeletalMuscleKg(segment: BodyCompositionSegment | undefined): number | null {
  const stored = toNumber(segment?.skeletalMuscleMassKg ?? null)
  if (stored !== null) return stored
  const lean = toNumber(segment?.leanMassKg ?? null)
  return lean !== null ? (segmentSkeletalKg(lean) ?? null) : null
}

export function getSegment(
  composition: BodyComposition | undefined,
  segment: BodySegment,
): BodyCompositionSegment | undefined {
  return composition?.segments.find((s) => s.segment === segment)
}
