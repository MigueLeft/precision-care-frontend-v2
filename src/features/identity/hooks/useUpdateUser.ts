import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUser } from '../services/users.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UserAccount, UpdateUserPayload } from '../types'

interface UseUpdateUserOptions {
  onSuccess?: (user: UserAccount) => void
}

export function useUpdateUser(id: number | undefined, options?: UseUpdateUserOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(id as number, payload),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: identityKeys.users })
      toast.success('Usuario actualizado correctamente')
      options?.onSuccess?.(user)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el usuario'))
    },
  })
}
