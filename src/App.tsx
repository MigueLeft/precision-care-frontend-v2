import { RouterProvider } from '@tanstack/react-router'
import { useSession } from '@/features/auth'
import { router } from '@/router'

export default function App() {
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) return null

  return <RouterProvider router={router} context={{ isAuthenticated }} />
}
