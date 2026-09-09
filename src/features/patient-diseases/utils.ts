import { formatFreeDate } from '@/utils/format-date'

// La fecha de diagnóstico se guarda como texto libre; se muestra en día/mes/año.
export function formatDxDate(dxDate: string | null): string {
  return formatFreeDate(dxDate)
}
