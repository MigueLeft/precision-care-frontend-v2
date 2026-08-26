import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Box } from '@mui/material'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    // Redirige al dashboard si ya hay sesión activa
    if (context.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Outlet />
    </Box>
  )
}
