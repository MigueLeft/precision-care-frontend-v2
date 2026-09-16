import { Box, useMediaQuery, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const theme = useTheme()
  // En laptops (≤ xl) el sidebar se compacta a solo iconos, con tooltip al hover.
  const compactSidebar = useMediaQuery(theme.breakpoints.down('xl'))

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
