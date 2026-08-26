import { useSession as useBetterAuthSession } from '../services/auth-client'

export function useSession() {
  const session = useBetterAuthSession()
  return {
    user: session.data?.user ?? null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
  }
}
