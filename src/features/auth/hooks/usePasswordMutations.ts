import { useMutation } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { authClient } from '../services/auth-client'
import type { ChangePasswordValues } from '../types'

// Códigos de error de better-auth → mensajes para el usuario.
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_PASSWORD: 'La contraseña actual no es correcta.',
  INVALID_TOKEN: 'El enlace no es válido o ya venció. Solicita uno nuevo.',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres.',
  PASSWORD_TOO_LONG: 'La contraseña no puede tener más de 128 caracteres.',
}

function authError(error: { code?: string; message?: string }, fallback: string) {
  return new Error((error.code && ERROR_MESSAGES[error.code]) || fallback)
}

// Envía el correo con el enlace para crear una nueva contraseña. Por
// seguridad, la respuesta es la misma exista o no la cuenta.
export function useRequestPasswordReset(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/restablecer-contrasena`,
      })
      if (error) throw authError(error, 'No se pudo enviar el correo de recuperación.')
    },
    onSuccess: () => {
      toast.success('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.')
      options?.onSuccess?.()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

// Guarda la nueva contraseña con el token del enlace del correo.
export function useResetPassword(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      const { error } = await authClient.resetPassword({ token, newPassword })
      if (error) throw authError(error, 'No se pudo restablecer la contraseña.')
    },
    onSuccess: () => {
      toast.success('Contraseña restablecida. Ya puedes iniciar sesión.')
      options?.onSuccess?.()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

// Cambio de contraseña con sesión iniciada; cierra las demás sesiones.
export function useChangePassword(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: ChangePasswordValues) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (error) throw authError(error, 'No se pudo cambiar la contraseña.')
    },
    onSuccess: () => {
      toast.success('Contraseña actualizada. Se cerraron tus otras sesiones abiertas.')
      options?.onSuccess?.()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
