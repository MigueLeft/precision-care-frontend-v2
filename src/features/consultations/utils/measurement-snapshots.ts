import { ANTHROPOMETRY_PARAMS, gripAsymmetryPct } from '@/features/anthropometry'
import { truncateTo } from '@/utils/parse-numeric'
import type { NumericSnapshot } from '../types'

export interface MeasurementParam {
  key: string
  label: string
  unit: string
  decimals?: number
}

export interface MeasurementValue extends MeasurementParam {
  value: number
}

export interface MeasurementChange extends MeasurementParam {
  before: number | null
  after: number
}

// Parámetros de antropometría (capturados y calculados), en orden.
export const MEASUREMENT_PARAMS: MeasurementParam[] = ANTHROPOMETRY_PARAMS

// Snapshot del backend + la asimetría de fuerza, que solo se calcula al mostrar.
export function anthropometrySnapshot(snapshot: NumericSnapshot): NumericSnapshot {
  const right = snapshot.gripRightKg ?? undefined
  const left = snapshot.gripLeftKg ?? undefined
  return { ...snapshot, gripAsymmetryPct: gripAsymmetryPct(right, left) ?? null }
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

// Solo los parámetros medidos ahora cuyo valor (con sus decimales) cambió.
export function changedMeasurements(
  params: MeasurementParam[],
  before: NumericSnapshot | null,
  after: NumericSnapshot,
): MeasurementChange[] {
  return params.flatMap((param) => {
    const next = after[param.key]
    if (next == null) return []
    const prev = before?.[param.key] ?? null
    const decimals = param.decimals ?? 1
    if (prev != null && truncateTo(prev, decimals) === truncateTo(next, decimals)) return []
    return [{ ...param, before: prev, after: next }]
  })
}
