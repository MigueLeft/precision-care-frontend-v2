// Talla del IM1 (variante 'height_cm'): siempre en centímetros.

export const HEIGHT_MIN_CM = 50
export const HEIGHT_MAX_CM = 250

// Si escribieron metros ("1.72" o "1,72"), se pasa a centímetros ("172").
export function normalizeHeightCm(raw: string): string {
  const value = Number(raw.replace(',', '.'))
  if (!Number.isFinite(value) || value <= 0) return raw
  if (value < 3) return String(Math.round(value * 100))
  return raw
}

export function heightError(raw: string): string | null {
  if (raw.trim() === '') return null
  const value = Number(raw.replace(',', '.'))
  if (!Number.isFinite(value) || value < HEIGHT_MIN_CM || value > HEIGHT_MAX_CM) {
    return `La altura debe estar en centímetros, entre ${HEIGHT_MIN_CM} y ${HEIGHT_MAX_CM} (por ejemplo, 172).`
  }
  return null
}
