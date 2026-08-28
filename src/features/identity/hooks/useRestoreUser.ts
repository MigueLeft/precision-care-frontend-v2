import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { restoreUser } from '../services/users.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseRestoreUserOptions {
  onSuccess?: () => void
}

export function useRestoreUser(options?: UseRestoreUserOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => restoreUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.users })
      toast.success('Usuario restaurado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al restaurar el usuario'))
    },
  })
}
