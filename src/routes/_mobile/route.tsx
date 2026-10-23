import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { MobileShell } from '@/components/layout/MobileShell'
import { MobileUserMenu } from '@/features/auth'

// App de citas (PWA): pantallas para el teléfono, sin el menú del sistema.
export const Route = createFileRoute('/_mobile')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: '/agenda' } })
    }
  },
  component: MobileLayout,
})

function MobileLayout() {
  return (
    <MobileShell title="Agenda" actions={<MobileUserMenu />}>
      <Outlet />
    </MobileShell>
  )
}
