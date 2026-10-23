import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { BrandLogo } from '@/components/BrandLogo'
import { LoginBrandPanel } from './LoginBrandPanel'

type AuthPageLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

// Pantallas sin sesión (login, recuperar y restablecer contraseña): panel de
// marca a la izquierda y el formulario a la derecha.
export function AuthPageLayout({ title, subtitle, children }: AuthPageLayoutProps) {
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
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'flex', md: 'none' }, mb: 5, alignItems: 'center', justifyContent: 'center' }}
          >
            <BrandLogo height={32} variant="dark" />
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#001d4a' }}>PrecisionCare</Typography>
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" sx={{ fontSize: '26px', fontWeight: 700, color: '#001d4a', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {subtitle}
            </Typography>
          </Box>

          {children}

          {/* Nota de seguridad */}
          <Stack
            direction="row"
            spacing={0.75}
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
