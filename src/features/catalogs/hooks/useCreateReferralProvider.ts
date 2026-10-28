import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { createReferralProvider } from '../services/referral-providers.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateReferralProvider(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReferralProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.referralProviders })
      toast.success('Centro de referencia creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el centro de referencia'))
    },
  })
}
