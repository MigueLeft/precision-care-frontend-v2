import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { PasswordField } from '@/components/PasswordField'
import { useResetPassword } from '../hooks/usePasswordMutations'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/password.schema'

type ResetPasswordFormProps = {
  token: string
}

// Nueva contraseña a partir del enlace del correo; al guardarla, al login.
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const reset = useResetPassword({ onSuccess: () => void navigate({ to: '/login' }) })
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  return (
    <Stack
      component="form"
      spacing={2.5}
      noValidate
      onSubmit={handleSubmit(({ newPassword }) => reset.mutate({ token, newPassword }))}
    >
      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <PasswordField
            {...field}
            label="Nueva contraseña"
            autoComplete="new-password"
            error={!!error}
            helperText={error?.message ?? 'Mínimo 8 caracteres'}
            disabled={reset.isPending}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <PasswordField
            {...field}
            label="Confirmar contraseña"
            autoComplete="new-password"
            error={!!error}
            helperText={error?.message}
            disabled={reset.isPending}
          />
        )}
      />
      <AppButton type="submit" variant="contained" size="large" fullWidth loading={reset.isPending}>
        Guardar contraseña
      </AppButton>
    </Stack>
  )
}
