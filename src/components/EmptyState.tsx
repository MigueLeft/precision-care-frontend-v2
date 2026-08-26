import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  action?: ReactNode
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 4,
        px: 3,
        border: '1px dashed',
        borderColor: 'grey.300',
        borderRadius: 1.5,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
        {message}
      </Typography>
      {action}
    </Box>
  )
}
