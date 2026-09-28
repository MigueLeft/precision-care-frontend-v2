import {
  GENERAL_PARAMS,
  getSegment,
  type BodyComposition,
} from '@/features/body-composition'
import {
  PHYSICAL_EXAM_PARAMS,
  computePhysicalExam,
  type PhysicalExamMeasurements,
} from '@/features/physical-exam'
import { toNumber, truncateTo } from '@/utils/parse-numeric'
import type { NumericSnapshot } from '../types'

export interface MeasurementParam {
  key: string
  label: string
  unit: string
}

export interface MeasurementValue extends MeasurementParam {
  value: number
}

export interface MeasurementChange extends MeasurementParam {
  before: number | null
  after: number
}

export const BODY_COMPOSITION_PARAMS: MeasurementParam[] = GENERAL_PARAMS
export const PHYSICAL_PARAMS: MeasurementParam[] = PHYSICAL_EXAM_PARAMS

// Valores de una medición de composición corporal con las claves de GENERAL_PARAMS.
export function bodyCompositionSnapshot(composition: BodyComposition): NumericSnapshot {
  const total = getSegment(composition, 'total')
  return {
    heightCm: toNumber(composition.heightCm),
    weightKg: toNumber(composition.weightKg),
    bmi: toNumber(composition.bmi),
    basalMetabolismKcal: toNumber(composition.basalMetabolismKcal),
    totalFatPct: toNumber(total?.fatMassPct),
    totalFatKg: toNumber(total?.fatMassKg),
    totalLeanKg: toNumber(total?.leanMassKg),
    totalWaterKg: toNumber(composition.totalWaterKg),
  }
}

// Examen físico con los parámetros calculados (IMC, grasa kg, masa magra).
export function physicalExamSnapshot(
  measurements: PhysicalExamMeasurements | NumericSnapshot | null,
): NumericSnapshot {
  const clean: Record<string, number | undefined> = {}
  for (const [key, value] of Object.entries(measurements ?? {})) {
    if (typeof value === 'number') clean[key] = value
  }
  const computed = computePhysicalExam(clean)
  return Object.fromEntries(
    Object.entries(computed).map(([key, value]) => [key, value ?? null]),
  )
}

// Parámetros con valor, en el orden de la configuración.
export function measurementValues(
  params: MeasurementParam[],
  snapshot: NumericSnapshot,
): MeasurementValue[] {
  return params.flatMap((param) => {
    const value = snapshot[param.key]
    return value == null ? [] : [{ ...param, value }]
  })
}

// Solo los parámetros medidos ahora cuyo valor (a 1 decimal) cambió.
export function changedMeasurements(
  params: MeasurementParam[],
  before: NumericSnapshot | null,
  after: NumericSnapshot,
): MeasurementChange[] {
  return params.flatMap((param) => {
    const next = after[param.key]
    if (next == null) return []
    const prev = before?.[param.key] ?? null
    if (prev != null && truncateTo(prev) === truncateTo(next)) return []
    return [{ ...param, before: prev, after: next }]
  })
}
