import { api } from '@/utils/api'
import type { AccountingFilters, AccountingList, AccountingReport, PaymentPayload, PricingPayload } from '../types'
import type { AccountingTransactionFilters, AccountingTransactionsList } from '../types'

export async function fetchAccountingAppointments(params: AccountingFilters) {
  return (await api.get<AccountingList>('/accounting/appointments', { params })).data
}
export async function fetchAccountingReport(from: string, to: string) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (await api.get<{ report: AccountingReport }>('/accounting/report', { params: { from, to, timezone } })).data.report
}
export async function fetchAccountingTransactions(filters: AccountingTransactionFilters) {
  const params = { ...filters, from: filters.from || undefined, to: filters.to || undefined }
  return (await api.get<AccountingTransactionsList>('/accounting/transactions', { params })).data
}
export async function payAppointment(id: number, payload: PaymentPayload) {
  return (await api.post<{ payment: { id: number } }>(`/accounting/appointments/${id}/payment`, payload)).data.payment
}
export async function updateAppointmentPricing(id: number, payload: PricingPayload) {
  return (await api.patch<{ appointment: { id: number } }>(`/accounting/appointments/${id}/pricing`, payload)).data.appointment
}
export async function voidAppointmentPayment(id: number, reason: string) {
  return (await api.delete<{ payment: { id: number } }>(`/accounting/appointments/${id}/payment`, { data: { reason } })).data.payment
}
