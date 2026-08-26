import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteUser } from '../services/users.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteUserOptions {
  onSuccess?: () => void
}

export function useDeleteUser(options?: UseDeleteUserOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.users })
      toast.success('Usuario eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el usuario'))
    },
  })
}
