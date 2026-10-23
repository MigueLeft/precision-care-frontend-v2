import { z } from 'zod'

// Mismos límites que better-auth en el backend (8–128 caracteres).
const passwordField = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128, 'La contraseña no puede tener más de 128 caracteres')

const passwordsMatch = (values: { newPassword: string; confirmPassword: string }) =>
  values.newPassword === values.confirmPassword
const MISMATCH = { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] }

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Ingresa un correo válido'),
})

export const resetPasswordSchema = z
  .object({ newPassword: passwordField, confirmPassword: z.string() })
  .refine(passwordsMatch, MISMATCH)

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual'),
    newPassword: passwordField,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, MISMATCH)
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: 'La nueva contraseña debe ser distinta a la actual',
    path: ['newPassword'],
  })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
