import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface AppShellProps {
  children: ReactNode
}

// Rutas donde el contenido necesita todo el ancho posible (consulta y expediente).
const DENSE_ROUTES = /\/(consultas_|pacientes_)\//

export function AppShell({ children }: AppShellProps) {
  const theme = useTheme()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  // En laptops (≤ xl) el sidebar se compacta dentro de consulta / expediente.
  const isLaptop = useMediaQuery(theme.breakpoints.down('xl'))
  const compactSidebar = isLaptop && DENSE_ROUTES.test(pathname)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar compact={compactSidebar} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <Box sx={{ flex: 1, p: 4, bgcolor: 'background.default' }}>{children}</Box>
      </Box>
    </Box>
  )
}
