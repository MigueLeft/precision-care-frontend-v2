import { redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { identityKeys } from '../hooks/identity.keys'
import { fetchMe } from '../services/me.service'
import { hasPermission } from './permissions'

// `beforeLoad` de una ruta que exige un permiso: sin él se vuelve al inicio
// (antes de que el loader pida datos que responderían 403).
export function requirePermission(code: string) {
  return async ({ context }: { context: { queryClient: QueryClient } }) => {
    const me = await context.queryClient.ensureQueryData({ queryKey: identityKeys.me, queryFn: fetchMe })
    if (!hasPermission(me, code)) throw redirect({ to: '/' })
  }
}
