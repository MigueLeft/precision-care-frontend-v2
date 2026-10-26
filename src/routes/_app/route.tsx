import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { PAGE_PERMISSIONS, useCan } from '@/features/identity'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const { can } = useCan()
  // Pantallas sin permiso de lectura no aparecen en el menú.
  const isNavAllowed = (to: string) => !PAGE_PERMISSIONS[to] || can(PAGE_PERMISSIONS[to])
  return (
    <AppShell isNavAllowed={isNavAllowed}>
      <Outlet />
    </AppShell>
  )
}
