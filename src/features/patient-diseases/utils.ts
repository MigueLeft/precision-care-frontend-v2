import { formatShortDate } from '@/utils/format-date'

// La fecha de diagnóstico se guarda como texto libre. Si es una fecha ISO
// completa se muestra como día mes año; si no, tal cual se capturó.
export function formatDxDate(dxDate: string | null): string {
  if (!dxDate) return '—'
  if (/^\d{4}-\d{2}-\d{2}/.test(dxDate)) return formatShortDate(dxDate)
  return dxDate
}
