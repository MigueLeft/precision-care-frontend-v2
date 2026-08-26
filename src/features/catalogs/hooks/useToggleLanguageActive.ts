import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleLanguageActive } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleLanguageActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleLanguageActive,
    onSuccess: (language) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.languages })
      toast.success(
        language.active ? `${language.name} marcado como activo` : `${language.name} marcado como inactivo`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el idioma'))
    },
  })
}
