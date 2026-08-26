import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createRole } from '../services/roles.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Role } from '../types'

interface UseCreateRoleOptions {
  onSuccess?: (role: Role) => void
}

export function useCreateRole(options?: UseCreateRoleOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRole,
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: identityKeys.roles })
      toast.success(`Rol ${role.name} creado correctamente`)
      options?.onSuccess?.(role)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el rol'))
    },
  })
}
