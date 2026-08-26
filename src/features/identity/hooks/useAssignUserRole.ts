import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { assignUserRole } from '../services/users.service'
import { identityKeys } from './identity.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useAssignUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) => assignUserRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityKeys.users })
      queryClient.invalidateQueries({ queryKey: identityKeys.roles })
      toast.success('Rol asignado correctamente')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al asignar el rol'))
    },
  })
}
