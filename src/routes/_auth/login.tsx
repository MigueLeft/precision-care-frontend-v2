import { createFileRoute } from '@tanstack/react-router'
import { Box, Link, Stack, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { LoginBrandPanel } from '@/features/auth/components/LoginBrandPanel'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

      {/* Panel izquierdo — Marca (oculto en móvil) */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: '0 0 44%' }}>
        <LoginBrandPanel />
      </Box>

      {/* Panel derecho — Formulario */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#ffffff',
          px: { xs: 3, sm: 6, lg: 10 },
          py: 6,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>

          {/* Logo móvil */}
          <Stack
            direction="row" spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' }, mb: 5, alignItems: 'center', justifyContent: 'center' }}
          >
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '6px',
                bgcolor: 'rgba(4,110,163,0.1)', border: '1px solid rgba(4,110,163,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Box component="span" sx={{ color: '#046ea3', fontSize: 18, lineHeight: 1 }}>+</Box>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#001d4a' }}>
              Precision Care
            </Typography>
          </Stack>

          {/* Encabezado */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: '26px', fontWeight: 700, color: '#001d4a', mb: 1 }}
            >
              Bienvenido de vuelta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Ingresa tus credenciales para acceder al sistema
            </Typography>
          </Box>

          {/* Formulario */}
          <LoginForm />

          {/* ¿Olvidaste contraseña? */}
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Link
              href="#"
              underline="hover"
              sx={{ fontSize: '13px', color: '#046ea3', fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          {/* Nota de seguridad */}
          <Stack
            direction="row" spacing={0.75}
            sx={{ mt: 6, pt: 4, borderTop: '1px solid #e5e7eb', alignItems: 'center' }}
          >
            <LockOutlinedIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              Acceso protegido con encriptación SSL de 256 bits
            </Typography>
          </Stack>

        </Box>
      </Box>
    </Box>
  )
}
