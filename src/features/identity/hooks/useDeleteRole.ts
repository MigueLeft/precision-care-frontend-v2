import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteRole } from '../services/roles.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeleteRoleOptions {
  onSuccess?: () => void
}

export function useDeleteRole(options?: UseDeleteRoleOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.roles })
      toast.success('Rol eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el rol'))
    },
  })
}
