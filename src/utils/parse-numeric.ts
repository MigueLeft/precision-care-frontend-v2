// Los campos `numeric` de Drizzle llegan al frontend como string (o null).
// Estos helpers los normalizan a number para cálculos y formateo.

export function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatNumber(
  value: string | number | null | undefined,
  fractionDigits = 1,
): string {
  const parsed = toNumber(value)
  if (parsed === null) return '—'
  return parsed.toLocaleString('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  })
}
