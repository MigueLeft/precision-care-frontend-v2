import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateRole } from '../services/roles.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Role, UpdateRolePayload } from '../types'

interface UseUpdateRoleOptions {
  onSuccess?: (role: Role) => void
}

export function useUpdateRole(id: number | undefined, options?: UseUpdateRoleOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateRolePayload) => updateRole(id as number, payload),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: identityKeys.roles })
      toast.success('Rol actualizado correctamente')
      options?.onSuccess?.(role)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el rol'))
    },
  })
}
