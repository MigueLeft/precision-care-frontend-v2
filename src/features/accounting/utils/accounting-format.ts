export function formatAmount(amount: number | null) {
  return amount == null ? 'Sin precio' : amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
export function currentMonthRange() {
  const now = new Date()
  const local = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return { from: local(new Date(now.getFullYear(), now.getMonth(), 1)), to: local(new Date(now.getFullYear(), now.getMonth() + 1, 0)) }
}
export function reportRange(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  end.setDate(end.getDate() + 1)
  const valid = Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end > start
  return { valid, from: valid ? start.toISOString() : '', to: valid ? end.toISOString() : '' }
}
