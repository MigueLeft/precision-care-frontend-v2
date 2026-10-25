import { GRID_SIDES, ORIENTATION_SPHERES, PULSE_GRID, REFLEX_GRID, STRENGTH_GRID } from '../config'
import type { AttrValue, ElementControl } from '../types'

// Controles especiales de algunos elementos: cuadrículas (pulsos, reflejos,
// fuerza) y esferas de orientación. Valores por defecto en N, detección de
// valores anormales y su texto para la narrativa.

type Grid = typeof PULSE_GRID

const GRIDS: Partial<Record<ElementControl, Grid>> = {
  pulses: PULSE_GRID,
  reflexes: REFLEX_GRID,
  strength: STRENGTH_GRID,
}

export const gridOf = (control: ElementControl | undefined) => (control ? GRIDS[control] : undefined)

export const gridKey = (row: string, side: string) => `${row}_${side}`

export const GLASGOW_KEYS = { eye: 'glasgow_o', verbal: 'glasgow_v', motor: 'glasgow_m' }

// Valores precargados cuando el elemento queda en N.
export function defaultValues(control: ElementControl | undefined): Record<string, AttrValue> {
  const grid = gridOf(control)
  if (grid) {
    return Object.fromEntries(
      grid.rows.flatMap((row) => GRID_SIDES.map((side) => [gridKey(row.key, side.key), grid.normal])),
    )
  }
  if (control === 'orientation') return Object.fromEntries(ORIENTATION_SPHERES.map((s) => [s.key, 'si']))
  return {}
}

// ¿Algún valor del control se sale de lo normal? (→ el elemento pasa a A)
export function hasAbnormalValues(control: ElementControl | undefined, values: Record<string, AttrValue>): boolean {
  const grid = gridOf(control)
  if (grid) {
    return grid.rows.some((row) =>
      GRID_SIDES.some((side) => {
        const value = values[gridKey(row.key, side.key)]
        return value != null && value !== grid.normal
      }),
    )
  }
  if (control === 'orientation') return ORIENTATION_SPHERES.some((s) => values[s.key] === 'no')
  return false
}

// "Pulso pedio izquierdo 1+, pulso radial derecho 0" (solo los anormales).
export function describeAbnormalValues(control: ElementControl | undefined, values: Record<string, AttrValue>): string | null {
  const grid = gridOf(control)
  if (grid) {
    const parts = grid.rows.flatMap((row) =>
      GRID_SIDES.flatMap((side) => {
        const value = values[gridKey(row.key, side.key)]
        if (value == null || value === grid.normal) return []
        const scale = control === 'strength' ? `${value}/5` : `${value}`
        return [`${grid.noun.toLowerCase()} ${row.label.toLowerCase()} ${side.label} ${scale}`]
      }),
    )
    return parts.length ? parts.join(', ') : null
  }
  if (control === 'orientation') {
    const lost = ORIENTATION_SPHERES.filter((s) => values[s.key] === 'no').map((s) => s.label)
    return lost.length ? `desorientado en ${joinList(lost)}` : null
  }
  return null
}

// Frase normal de la orientación: solo las esferas marcadas.
export function orientationPhrase(values: Record<string, AttrValue>): string | null {
  const kept = ORIENTATION_SPHERES.filter((s) => values[s.key] !== 'no').map((s) => s.label)
  return kept.length ? `Paciente alerta y orientado en ${joinList(kept)}` : null
}

// "Glasgow 13/15 (O3 V4 M6)" si están los tres componentes.
export function glasgowText(values: Record<string, AttrValue>): string | null {
  const [o, v, m] = [values[GLASGOW_KEYS.eye], values[GLASGOW_KEYS.verbal], values[GLASGOW_KEYS.motor]].map(Number)
  if (!o || !v || !m) return null
  return `Glasgow ${o + v + m}/15 (O${o} V${v} M${m})`
}

// "a", "a y b", "a, b y c".
export function joinList(items: string[], last = 'y'): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} ${last} ${items[items.length - 1]}`
}
