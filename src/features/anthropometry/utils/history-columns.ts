import { anthropometryValues, type ValueMap } from './anthropometry-calculations'
import type { Anthropometry } from '../types'

// Columna del histórico junto a la captura (una medición anterior).
export interface AnthropometryHistoryColumn {
  id: number
  date: string
  values: ValueMap
}

// Las últimas `limit` mediciones, de la más vieja (izquierda) a la más nueva
// (derecha). `rows` llega de la más reciente a la más antigua.
export function historyColumns(rows: Anthropometry[], limit = 3): AnthropometryHistoryColumn[] {
  return rows
    .slice(0, limit)
    .reverse()
    .map((row) => ({ id: row.id, date: row.assessmentDate, values: anthropometryValues(row) }))
}
