import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useRequestPasswordReset } from '../hooks/usePasswordMutations'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/password.schema'

// Pide el correo y envía el enlace para crear una nueva contraseña.
export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const { control, handleSubmit, getValues } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })
  const request = useRequestPasswordReset({ onSuccess: () => setSentTo(getValues('email')) })

  return (
    <Stack
      component="form"
      spacing={2.5}
      noValidate
      onSubmit={handleSubmit(({ email }) => request.mutate(email))}
    >
      {sentTo && (
        <Alert severity="success">
          Si <strong>{sentTo}</strong> está registrado, en unos minutos recibirás un correo con el enlace para
          crear una nueva contraseña. Revisa también tu carpeta de spam.
        </Alert>
      )}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="nombre@ejemplo.com"
            error={!!error}
            helperText={error?.message}
            disabled={request.isPending}
          />
        )}
      />
      <AppButton type="submit" variant="contained" size="large" fullWidth loading={request.isPending}>
        {sentTo ? 'Reenviar enlace' : 'Enviar enlace'}
      </AppButton>
    </Stack>
  )
}
