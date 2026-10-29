import { toNumber } from '@/utils/parse-numeric'
import { ANTHROPOMETRY_PARAMS } from '../config'
import { SEGMENTS } from '../segment-config'
import type { Anthropometry, AnthropometrySegmentType, AnthropometryValueKey } from '../types'

// Vista previa de los valores calculados mientras se captura. El backend repite
// estas fórmulas al guardar y es la fuente de verdad.

export type ValueMap = Partial<Record<AnthropometryValueKey, number>>
export type SegmentLean = Partial<Record<AnthropometrySegmentType, number>>

const LIMBS: AnthropometrySegmentType[] = ['left_arm', 'right_arm', 'left_leg', 'right_leg']

const round = (value: number, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals
const has = (value: number | undefined): value is number =>
  value !== undefined && Number.isFinite(value)
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

// Masa músculo esquelética de un segmento = 0.566 × masa magra del segmento.
export function segmentSkeletalKg(leanKg: number | undefined): number | undefined {
  return has(leanKg) ? round(0.566 * leanKg) : undefined
}

// Diferencia entre manos respecto a la más fuerte (%).
export function gripAsymmetryPct(
  right: number | undefined,
  left: number | undefined,
): number | undefined {
  if (!has(right) || !has(left) || Math.max(right, left) <= 0) return undefined
  return round((Math.abs(right - left) / Math.max(right, left)) * 100)
}

// bySegments: con composición por segmento la masa músculo esquelética y la
// masa magra apendicular salen de los segmentos; sin ella, de lo capturado.
export function computeAnthropometry(
  values: ValueMap,
  segmentLean: SegmentLean,
  bySegments = true,
): ValueMap {
  const { heightCm, weightKg, fatMassPct } = values
  const { abdominalCircCm, hipCircCm, brachialCircCm, tricepsSkinfoldMm } = values
  const heightM2 = has(heightCm) && heightCm > 0 ? (heightCm / 100) ** 2 : undefined
  const fatMassKg =
    has(weightKg) && has(fatMassPct) ? round((weightKg * fatMassPct) / 100) : undefined
  const skeletal = SEGMENTS.map((s) => segmentSkeletalKg(segmentLean[s])).filter(has)
  // Masa magra apendicular: suma de la masa magra de las cuatro extremidades.
  const limbs = LIMBS.map((s) => segmentLean[s])
  const alm = bySegments
    ? limbs.every(has)
      ? round(sum(limbs))
      : undefined
    : values.appendicularLeanMassKg
  const smm = bySegments
    ? skeletal.length > 0
      ? round(sum(skeletal))
      : undefined
    : values.skeletalMuscleMassKg

  return {
    ...values,
    bmi: has(weightKg) && heightM2 ? round(weightKg / heightM2) : undefined,
    fatMassKg,
    leanMassPct: has(fatMassPct) ? round(100 - fatMassPct) : undefined,
    leanMassKg: has(weightKg) && has(fatMassKg) ? round(weightKg - fatMassKg) : undefined,
    skeletalMuscleMassKg: smm,
    appendicularLeanMassKg: alm,
    appendicularLeanMassIndex: has(alm) && heightM2 ? round(alm / heightM2) : undefined,
    waistHipRatio:
      has(abdominalCircCm) && has(hipCircCm) && hipCircCm > 0
        ? round(abdominalCircCm / hipCircCm, 3)
        : undefined,
    // CMB = circunferencia braquial (cm) − π × pliegue tricipital (mm → cm).
    armMuscleCircCm:
      has(brachialCircCm) && has(tricepsSkinfoldMm)
        ? round(brachialCircCm - Math.PI * (tricepsSkinfoldMm / 10))
        : undefined,
    gripAsymmetryPct: gripAsymmetryPct(values.gripRightKg, values.gripLeftKg),
  }
}

// Valores guardados de una medición (+ la asimetría, que solo se muestra).
export function anthropometryValues(row: Anthropometry | null | undefined): ValueMap {
  if (!row) return {}
  const values: ValueMap = {}
  for (const param of ANTHROPOMETRY_PARAMS) {
    if (param.key === 'gripAsymmetryPct') continue
    const value = toNumber(row[param.key])
    if (value !== null) values[param.key] = value
  }
  values.gripAsymmetryPct = gripAsymmetryPct(values.gripRightKg, values.gripLeftKg)
  return values
}

// De la más reciente a la más antigua; a igual fecha, la última registrada primero.
export function sortAnthropometries(rows: Anthropometry[]): Anthropometry[] {
  return [...rows].sort(
    (a, b) => b.assessmentDate.localeCompare(a.assessmentDate) || b.id - a.id,
  )
}

export function getSegment(row: Anthropometry | undefined, segment: AnthropometrySegmentType) {
  return row?.segments.find((s) => s.segment === segment)
}
