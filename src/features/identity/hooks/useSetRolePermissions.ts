import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { setRolePermissions } from '../services/roles.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Role } from '../types'

interface UseSetRolePermissionsOptions {
  onSuccess?: (role: Role) => void
}

export function useSetRolePermissions(roleId: number | undefined, options?: UseSetRolePermissionsOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionIds: number[]) => setRolePermissions(roleId as number, permissionIds),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: identityKeys.roles })
      toast.success('Permisos actualizados correctamente')
      options?.onSuccess?.(role)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar los permisos'))
    },
  })
}
