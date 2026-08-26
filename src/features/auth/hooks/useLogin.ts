import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { signIn } from '../services/auth-client'
import type { LoginCredentials } from '../types'

interface UseLoginOptions {
  onSuccess?: () => void
}

export function useLogin(options?: UseLoginOptions) {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data, error } = await signIn.email(credentials)
      if (error) throw new Error(error.message ?? 'Error al iniciar sesión')
      return data
    },
    onSuccess: () => {
      toast.success('Sesión iniciada correctamente')
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Credenciales inválidas')
    },
  })
}
