import type {
  ParaclinicalOrderStatus,
  ParaclinicalResult,
  ParaclinicalResultGroup,
  ParaclinicalResultValue,
  ParaclinicalValueStatus,
} from '../types'

export const PARACLINICAL_VALUE_STATUS_LABELS: Record<
  ParaclinicalValueStatus,
  string
> = {
  normal: 'Normal',
  high: 'Alto',
  low: 'Bajo',
  critical: 'Crítico',
}

export const PARACLINICAL_VALUE_STATUS_COLORS: Record<
  ParaclinicalValueStatus,
  'success' | 'warning' | 'error'
> = {
  normal: 'success',
  low: 'warning',
  high: 'warning',
  critical: 'error',
}

export const PARACLINICAL_ORDER_STATUS_LABELS: Record<
  ParaclinicalOrderStatus,
  string
> = {
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export const PARACLINICAL_ORDER_STATUS_COLORS: Record<
  ParaclinicalOrderStatus,
  'warning' | 'success' | 'default'
> = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'default',
}

export function formatReferenceRange(value: ParaclinicalResultValue): string {
  const { referenceMin, referenceMax } = value
  if (referenceMin && referenceMax) return `${referenceMin}–${referenceMax}`
  if (referenceMax) return `<${referenceMax}`
  if (referenceMin) return `>${referenceMin}`
  return '—'
}

// Aplana los analitos de los resultados más recientes para el widget "Últimos laboratorios".
export function getLatestAnalytes(
  results: ParaclinicalResult[],
  limit = 5,
): Array<ParaclinicalResultValue & { resultDate: string }> {
  return results
    .flatMap((result) =>
      result.values.map((value) => ({
        ...value,
        resultDate: result.resultDate,
      })),
    )
    .slice(0, limit)
}

// Agrupa los resultados por día (y laboratorio) para mostrarlos en una sola
// sección por fecha, de la más reciente a la más antigua.
export function groupResultsByDay(results: ParaclinicalResult[]): ParaclinicalResultGroup[] {
  const groups = new Map<string, ParaclinicalResultGroup>()
  const sorted = [...results].sort(
    (a, b) => b.resultDate.localeCompare(a.resultDate) || b.id - a.id,
  )
  for (const result of sorted) {
    const key = `${result.resultDate.slice(0, 10)}|${result.laboratory ?? ''}`
    const group = groups.get(key) ?? {
      key,
      resultDate: result.resultDate,
      laboratory: result.laboratory,
      resultIds: [],
      values: [],
    }
    group.resultIds.push(result.id)
    group.values.push(...result.values.map((value) => ({ ...value, resultId: result.id })))
    groups.set(key, group)
  }
  return [...groups.values()]
}
