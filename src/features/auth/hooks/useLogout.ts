import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { signOut } from '../services/auth-client'

interface UseLogoutOptions {
  onSuccess?: () => void
}

export function useLogout(options?: UseLogoutOptions) {
  return useMutation({
    mutationFn: async () => {
      const { error } = await signOut()
      if (error) throw new Error(error.message ?? 'Error al cerrar sesión')
    },
    onSuccess: () => {
      toast.success('Sesión cerrada correctamente')
      options?.onSuccess?.()
    },
    onError: () => {
      toast.error('Error al cerrar sesión')
    },
  })
}
