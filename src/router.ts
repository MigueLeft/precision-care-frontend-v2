import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { queryClient } from '@/utils/query-client'
import { RoutePending } from '@/components/ui/RoutePending'
import type { RouterContext } from '@/routes/__root'

export const router = createRouter({
  routeTree,
  context: { isAuthenticated: false, queryClient } satisfies RouterContext,
  // Precarga chunk + loader al pasar el mouse por un Link, así el clic ya
  // encuentra todo listo.
  defaultPreload: 'intent',
  // La frescura de los datos la controla React Query (staleTime), no el router.
  defaultPreloadStaleTime: 0,
  // Por defecto el router espera 1000 ms antes de mostrar el pending y lo deja
  // visible mínimo 500 ms: se ve como una página congelada. Aquí aparece a los
  // 100 ms (evita parpadeo si los datos ya están en caché) y sin mínimo.
  defaultPendingComponent: RoutePending,
  defaultPendingMs: 100,
  defaultPendingMinMs: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
