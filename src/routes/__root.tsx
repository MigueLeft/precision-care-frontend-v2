import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  isAuthenticated: boolean
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" closeButton />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  )
}
