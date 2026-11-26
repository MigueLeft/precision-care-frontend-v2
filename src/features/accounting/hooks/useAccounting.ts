import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentsKeys } from '@/features/appointments'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { fetchAccountingAppointments, fetchAccountingReport, payAppointment, updateAppointmentPricing, voidAppointmentPayment } from '../services/accounting.service'
import type { AccountingFilters, PaymentPayload, PricingPayload } from '../types'

export const accountingKeys = { all: ['accounting'] as const }
export function useAccountingAppointments(filters: AccountingFilters) {
  return useQuery({ queryKey: [...accountingKeys.all, 'appointments', filters], queryFn: () => fetchAccountingAppointments(filters) })
}
export function useAccountingReport(from: string, to: string, enabled: boolean) {
  return useQuery({ queryKey: [...accountingKeys.all, 'report', from, to], queryFn: () => fetchAccountingReport(from, to), enabled })
}
function useAccountingMutation<T>(mutationFn: (variables: T) => Promise<unknown>, message: string, onSuccess?: () => void) {
  const client = useQueryClient()
  return useMutation({ mutationFn, onSuccess: () => {
    void client.invalidateQueries({ queryKey: accountingKeys.all })
    void client.invalidateQueries({ queryKey: appointmentsKeys.all })
    toast.success(message)
    onSuccess?.()
  }, onError: (error) => toast.error(getApiErrorMessage(error, 'No se pudo guardar el cambio en contabilidad.')) })
}
export function usePayAppointment(onSuccess: () => void) {
  return useAccountingMutation(({ id, payload }: { id: number; payload: PaymentPayload }) => payAppointment(id, payload), 'Pago registrado correctamente', onSuccess)
}
export function useUpdateAppointmentPricing(onSuccess: () => void) {
  return useAccountingMutation(({ id, payload }: { id: number; payload: PricingPayload }) => updateAppointmentPricing(id, payload), 'Precio actualizado correctamente', onSuccess)
}
export function useVoidAppointmentPayment(onSuccess: () => void) {
  return useAccountingMutation(({ id, reason }: { id: number; reason: string }) => voidAppointmentPayment(id, reason), 'Pago anulado; la cita vuelve a estar pendiente', onSuccess)
}
