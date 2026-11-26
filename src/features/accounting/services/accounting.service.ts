import { api } from '@/utils/api'
import type { AccountingFilters, AccountingList, AccountingReport, PaymentPayload, PricingPayload } from '../types'

export async function fetchAccountingAppointments(params: AccountingFilters) {
  return (await api.get<AccountingList>('/accounting/appointments', { params })).data
}
export async function fetchAccountingReport(from: string, to: string) {
  return (await api.get<{ report: AccountingReport }>('/accounting/report', { params: { from, to } })).data.report
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
