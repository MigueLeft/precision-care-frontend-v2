import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
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
      // Si cambió un rol del usuario de la sesión, se refrescan sus permisos.
      queryClient.invalidateQueries({ queryKey: identityKeys.me })
      toast.success('Rol actualizado correctamente')
      options?.onSuccess?.(role)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el rol'))
    },
  })
}
