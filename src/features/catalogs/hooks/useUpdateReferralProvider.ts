import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { updateReferralProvider } from '../services/referral-providers.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { ReferralProviderPayload } from '../types'

export function useUpdateReferralProvider(id: number | undefined, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReferralProviderPayload) => updateReferralProvider(id as number, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.referralProviders })
      toast.success('Centro de referencia actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el centro de referencia'))
    },
  })
}
