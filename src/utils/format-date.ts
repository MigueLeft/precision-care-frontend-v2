// Formateadores de fecha reutilizables (es-MX).

// Fecha sin hora ("2026-09-09"): se formatea como texto. `new Date()` la lee
// como medianoche UTC y en México se mostraría un día antes.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

// Formato día/mes/año numérico ("09/09/2026").
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const dateOnly = DATE_ONLY.exec(iso.trim())
  if (dateOnly) return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

// Fecha clínica en texto libre ("2026-09-09", "2026-09", "2019", "hace años").
// Se normaliza a día/mes/año numérico cuando la forma lo permite.
export function formatFreeDate(value: string | null | undefined): string {
  if (!value) return '—'
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return formatShortDate(trimmed)
  const monthYear = /^(\d{4})-(\d{2})$/.exec(trimmed)
  if (monthYear) return `${monthYear[2]}/${monthYear[1]}`
  return trimmed
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
