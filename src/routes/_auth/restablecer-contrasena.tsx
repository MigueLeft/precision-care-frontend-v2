import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { Alert, Box, Link } from '@mui/material'
import { z } from 'zod'
import { AuthPageLayout, ResetPasswordForm } from '@/features/auth'

// better-auth redirige aquí con ?token=... (válido) o ?error=INVALID_TOKEN.
const searchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/_auth/restablecer-contrasena')({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token, error } = Route.useSearch()
  const valid = !!token && !error

  return (
    <AuthPageLayout title="Crea una nueva contraseña" subtitle="Elige una contraseña de al menos 8 caracteres.">
      {valid ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Alert severity="error">
          El enlace no es válido o ya venció (dura 1 hora). Solicita uno nuevo para restablecer tu contraseña.
        </Alert>
      )}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Link component={RouterLink} to="/login" underline="hover" sx={{ fontSize: '13px', fontWeight: 500 }}>
          Iniciar sesión
        </Link>
        {!valid && (
          <Link
            component={RouterLink}
            to="/recuperar-contrasena"
            underline="hover"
            sx={{ fontSize: '13px', fontWeight: 500 }}
          >
            Solicitar un nuevo enlace
          </Link>
        )}
      </Box>
    </AuthPageLayout>
  )
}
