import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { Box, Link } from '@mui/material'
import { AuthPageLayout, ForgotPasswordForm } from '@/features/auth'

export const Route = createFileRoute('/_auth/recuperar-contrasena')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      title="Recupera tu contraseña"
      subtitle="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña."
    >
      <ForgotPasswordForm />
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Link component={RouterLink} to="/login" underline="hover" sx={{ fontSize: '13px', fontWeight: 500 }}>
          Volver a iniciar sesión
        </Link>
      </Box>
    </AuthPageLayout>
  )
}
