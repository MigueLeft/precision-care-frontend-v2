import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { Box, Link } from '@mui/material'
import { z } from 'zod'
import { AuthPageLayout, LoginForm } from '@/features/auth'

// ?redirect=/agenda: a dónde volver tras iniciar sesión (solo rutas internas).
const searchSchema = z.object({
  redirect: z
    .string()
    .regex(/^\/(?!\/)/)
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute('/_auth/login')({
  validateSearch: searchSchema,
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()

  return (
    <AuthPageLayout title="Bienvenido de vuelta" subtitle="Ingresa tus credenciales para acceder al sistema">
      <LoginForm redirectTo={redirect} />

      {/* ¿Olvidaste contraseña? */}
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Link
          component={RouterLink}
          to="/recuperar-contrasena"
          underline="hover"
          sx={{ fontSize: '13px', color: 'primary.main', fontWeight: 500 }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Box>
    </AuthPageLayout>
  )
}
