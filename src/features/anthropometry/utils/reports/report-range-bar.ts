import { statusOf, type Range } from './reference-ranges'
import { COLORS } from './report-shared'

// Posición (0–1) del valor en la barra Bajo | Normal | Alto: la zona normal
// ocupa el tercio central (o los dos primeros tercios si solo hay máximo).
function position(value: number, range: Range): number {
  const { min, max } = range
  const over = (limit: number) => Math.min((value - limit) / (limit * 0.3), 1)
  if (min !== undefined && max !== undefined) {
    if (value < min) return (Math.max(value, 0) / min) / 3
    if (value <= max) return 1 / 3 + ((value - min) / (max - min)) / 3
    return 2 / 3 + over(max) / 3
  }
  if (max !== undefined) return value <= max ? (Math.max(value, 0) / max) * (2 / 3) : 2 / 3 + over(max) / 3
  return min !== undefined && value >= min ? 2 / 3 : 1 / 3
}

// Barra horizontal: naranja si está fuera de rango, azul si es normal.
export function rangeBar(value: number | null, range: Range | null): string {
  if (value === null || !range) return '<span class="dash">—</span>'
  const out = statusOf(value, range) !== 'normal'
  const width = Math.max(position(value, range), 0.03) * 100
  const ticks = range.min !== undefined && range.max !== undefined ? [1 / 3, 2 / 3] : [2 / 3]
  return `<div class="rbar">
    <div class="rbar-fill" style="width:${width}%;background:${out ? COLORS.fat : COLORS.lean}"></div>
    ${ticks.map((t) => `<i style="left:${t * 100}%"></i>`).join('')}
  </div>`
}

export const rangeBarStyles = `
  .rbar { position: relative; height: 10px; background: #eef1f5; }
  .rbar-fill { height: 100%; }
  .rbar i { position: absolute; top: -3px; bottom: -3px; width: 1px; background: #c3cbd6; }
  .dash { display: block; text-align: center; color: ${COLORS.muted}; }
`
