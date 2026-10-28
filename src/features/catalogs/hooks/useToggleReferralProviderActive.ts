import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { toggleReferralProviderActive } from '../services/referral-providers.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleReferralProviderActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleReferralProviderActive,
    onSuccess: (provider) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.referralProviders })
      toast.success(
        provider.active ? `${provider.name} marcado como activo` : `${provider.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado del centro de referencia'))
    },
  })
}
