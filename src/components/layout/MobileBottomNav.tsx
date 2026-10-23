import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

export type MobileNavItem = {
  label: string
  to: '/agenda' | '/agenda/pacientes'
  icon: ReactNode
}

type MobileBottomNavProps = {
  items: MobileNavItem[]
  active: MobileNavItem['to']
}

// Barra inferior de la app de citas (como las apps del teléfono).
export function MobileBottomNav({ items, active }: MobileBottomNavProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation showLabels value={active}>
        {items.map((item) => (
          <BottomNavigationAction
            key={item.to}
            value={item.to}
            label={item.label}
            icon={item.icon}
            component={Link}
            to={item.to}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
