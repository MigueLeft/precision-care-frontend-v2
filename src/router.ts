import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { queryClient } from '@/utils/query-client'
import type { RouterContext } from '@/routes/__root'

export const router = createRouter({
  routeTree,
  context: { isAuthenticated: false, queryClient } satisfies RouterContext,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
