import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createUser } from '../services/users.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { UserAccount } from '../types'

interface UseCreateUserOptions {
  onSuccess?: (user: UserAccount) => void
}

export function useCreateUser(options?: UseCreateUserOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: identityKeys.users })
      toast.success(`Usuario ${user.name} ${user.lastName} creado correctamente`)
      options?.onSuccess?.(user)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el usuario'))
    },
  })
}
