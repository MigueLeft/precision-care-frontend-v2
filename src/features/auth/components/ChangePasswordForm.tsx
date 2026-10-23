import { Controller, useForm, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { PasswordField } from '@/components/PasswordField'
import { useChangePassword } from '../hooks/usePasswordMutations'
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas/password.schema'

const EMPTY: ChangePasswordFormValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

type FieldProps = {
  name: keyof ChangePasswordFormValues
  label: string
  hint?: string
  control: Control<ChangePasswordFormValues>
  disabled: boolean
}

function PasswordInput({ name, label, hint, control, disabled }: FieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PasswordField
          {...field}
          label={label}
          autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
          error={!!error}
          helperText={error?.message ?? hint}
          disabled={disabled}
          fullWidth
        />
      )}
    />
  )
}

// Cambio de contraseña del usuario con sesión iniciada (sección "Mi cuenta").
export function ChangePasswordForm() {
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  })
  const change = useChangePassword({ onSuccess: () => reset(EMPTY) })
  const disabled = change.isPending

  return (
    <Stack
      component="form"
      spacing={2}
      noValidate
      onSubmit={handleSubmit(({ currentPassword, newPassword }) => change.mutate({ currentPassword, newPassword }))}
      sx={{ maxWidth: 420 }}
    >
      <PasswordInput name="currentPassword" label="Contraseña actual" control={control} disabled={disabled} />
      <PasswordInput
        name="newPassword"
        label="Nueva contraseña"
        hint="Mínimo 8 caracteres"
        control={control}
        disabled={disabled}
      />
      <PasswordInput name="confirmPassword" label="Confirmar nueva contraseña" control={control} disabled={disabled} />
      <AppButton type="submit" variant="contained" loading={change.isPending} sx={{ alignSelf: 'flex-start' }}>
        Cambiar contraseña
      </AppButton>
    </Stack>
  )
}
