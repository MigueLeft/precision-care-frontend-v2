import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '../hooks/useLogin'

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => navigate({ to: '/' }),
  })

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => login(values))}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
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
            disabled={isPending}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            error={!!error}
            helperText={error?.message}
            disabled={isPending}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isPending}
        sx={{ mt: 0.5, py: 1.5 }}
        startIcon={
          isPending ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </Button>
    </Box>
  )
}
