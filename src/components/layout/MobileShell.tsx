import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BrandLogo } from '@/components/BrandLogo'

type MobileShellProps = {
  title: string
  // Acciones a la derecha de la barra (menú del usuario).
  actions?: ReactNode
  children: ReactNode
}

// Estructura de la app instalable (PWA): barra superior fija y contenido a
// pantalla completa, sin el menú lateral del sistema.
export function MobileShell({ title, actions, children }: MobileShellProps) {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          alignItems: 'center',
          px: 2,
          // Respeta la muesca / barra de estado del teléfono.
          pt: 'calc(env(safe-area-inset-top) + 10px)',
          pb: 1.25,
          bgcolor: 'brand.dark',
          color: 'common.white',
        }}
      >
        <BrandLogo height={26} variant="light" />
        <Typography sx={{ flex: 1, fontSize: '17px', fontWeight: 700 }}>{title}</Typography>
        {actions}
      </Stack>
      <Box sx={{ flex: 1, pb: 'calc(env(safe-area-inset-bottom) + 88px)' }}>{children}</Box>
    </Box>
  )
}
