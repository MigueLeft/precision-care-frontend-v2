import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { Box, Link } from '@mui/material'
import { AuthPageLayout, LoginForm } from '@/features/auth'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <AuthPageLayout title="Bienvenido de vuelta" subtitle="Ingresa tus credenciales para acceder al sistema">
      <LoginForm />

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
