import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography, Divider } from '@mui/material'

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        minHeight: '60vh',
      }}
    >
      <Typography variant="h2" color="text.primary">
        Dashboard
      </Typography>
      <Divider sx={{ width: 48, borderColor: 'primary.main', borderWidth: 2, my: 1 }} />
      <Typography variant="body1" color="text.secondary">
        El contenido del dashboard irá aquí.
      </Typography>
    </Box>
  )
}
