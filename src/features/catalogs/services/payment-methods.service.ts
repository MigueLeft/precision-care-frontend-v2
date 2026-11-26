import { api } from '@/utils/api'
import type { PaymentMethod, PaymentMethodPayload } from '../types/payment-method'

export async function fetchPaymentMethods(scope: 'catalogs' | 'accounting' = 'catalogs') {
  return (await api.get<{ paymentMethods: PaymentMethod[] }>(`/${scope}/payment-methods`)).data.paymentMethods
}
export async function savePaymentMethod(id: number | undefined, payload: PaymentMethodPayload) {
  const response = id === undefined
    ? await api.post<{ paymentMethod: PaymentMethod }>('/catalogs/payment-methods', payload)
    : await api.patch<{ paymentMethod: PaymentMethod }>(`/catalogs/payment-methods/${id}`, payload)
  return response.data.paymentMethod
}
export async function deletePaymentMethod(id: number) {
  return (await api.delete<{ paymentMethod: PaymentMethod }>(`/catalogs/payment-methods/${id}`)).data.paymentMethod
}
