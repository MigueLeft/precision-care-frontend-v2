// Los campos `numeric` de Drizzle llegan al frontend como string (o null).
// Estos helpers los normalizan a number para cálculos y formateo.

export function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

// Trunca (nunca redondea) a `fractionDigits` decimales. -1.28 -> -1.2.
export function truncateTo(value: number, fractionDigits = 1): number {
  const factor = 10 ** fractionDigits
  return Math.trunc(value * factor) / factor
}

// Formatea valores clínicos: siempre con exactamente 1 decimal y truncado, sin
// redondear. Los conteos/años/edades no pasan por aquí (se muestran como enteros).
export function formatNumber(
  value: string | number | null | undefined,
  fractionDigits = 1,
): string {
  const parsed = toNumber(value)
  if (parsed === null) return '—'
  return truncateTo(parsed, fractionDigits).toLocaleString('es-MX', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}
