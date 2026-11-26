import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { deletePaymentMethod, fetchPaymentMethods, savePaymentMethod } from '../services/payment-methods.service'
import type { PaymentMethodPayload } from '../types/payment-method'

const key = ['catalogs', 'payment-methods'] as const
export function usePaymentMethods(scope: 'catalogs' | 'accounting' = 'catalogs', enabled = true) {
  return useQuery({ queryKey: [...key, scope], queryFn: () => fetchPaymentMethods(scope), enabled })
}
export function useSavePaymentMethod(onSuccess: () => void) {
  const client = useQueryClient()
  return useMutation({ mutationFn: ({ id, payload }: { id?: number; payload: PaymentMethodPayload }) => savePaymentMethod(id, payload),
    onSuccess: () => { void client.invalidateQueries({ queryKey: key }); toast.success('Método de pago guardado'); onSuccess() },
    onError: (error) => toast.error(getApiErrorMessage(error, 'No se pudo guardar el método de pago.')) })
}
export function useDeletePaymentMethod(onSuccess: () => void) {
  const client = useQueryClient()
  return useMutation({ mutationFn: deletePaymentMethod,
    onSuccess: () => { void client.invalidateQueries({ queryKey: key }); toast.success('Método de pago eliminado'); onSuccess() },
    onError: (error) => toast.error(getApiErrorMessage(error, 'No se pudo eliminar el método de pago.')) })
}
