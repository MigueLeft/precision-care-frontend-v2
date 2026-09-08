import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface SectionCardProps {
  title?: ReactNode
  action?: ReactNode
  children: ReactNode
  /** Quita el padding interno del cuerpo (útil para tablas a sangre). */
  disableBodyPadding?: boolean
}

// Card presentacional del expediente: título + acción opcional + cuerpo.
// Sin sombras (el tema separa por bordes).
export function SectionCard({
  title,
  action,
  children,
  disableBodyPadding = false,
}: SectionCardProps) {
  return (
    <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      {(title || action) && (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {typeof title === 'string' ? (
            <Typography variant="h3">{title}</Typography>
          ) : (
            title
          )}
          {action}
        </Stack>
      )}
      <Box sx={{ p: disableBodyPadding ? 0 : 3 }}>{children}</Box>
    </Paper>
  )
}
