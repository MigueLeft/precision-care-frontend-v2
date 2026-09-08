// Formateadores de fecha reutilizables (es-MX).

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}
