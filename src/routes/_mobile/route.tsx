import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { MobileShell } from '@/components/layout/MobileShell'
import { MobileBottomNav, type MobileNavItem } from '@/components/layout/MobileBottomNav'
import { MobileUserMenu } from '@/features/auth'
import { PushNotificationsMenuItem } from '@/features/notifications'

// App de citas (PWA): pantallas para el teléfono, sin el menú del sistema.
export const Route = createFileRoute('/_mobile')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: '/agenda' } })
    }
  },
  component: MobileLayout,
})

const NAV_ITEMS: MobileNavItem[] = [
  { label: 'Agenda', to: '/agenda', icon: <CalendarMonthOutlinedIcon /> },
  { label: 'Pacientes', to: '/agenda/pacientes', icon: <PeopleAltOutlinedIcon /> },
]

function MobileLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const active = pathname.startsWith('/agenda/pacientes') ? '/agenda/pacientes' : '/agenda'

  return (
    <MobileShell
      title={active === '/agenda' ? 'Agenda' : 'Pacientes'}
      actions={<MobileUserMenu extraItems={<PushNotificationsMenuItem />} />}
    >
      <Outlet />
      <MobileBottomNav items={NAV_ITEMS} active={active} />
    </MobileShell>
  )
}
