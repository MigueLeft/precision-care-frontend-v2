import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'

type BoardHeaderProps = {
  title: string
  meta?: string
  children?: ReactNode
}

// Encabezado de una lista del panel central: título, contador y acciones.
export function BoardHeader({ title, meta, children }: BoardHeaderProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mb: 1.5 }}>
      <Typography variant="h3">{title}</Typography>
      {meta && <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{meta}</Typography>}
      {children && <Stack direction="row" spacing={1} sx={{ ml: 'auto', alignItems: 'center' }}>{children}</Stack>}
    </Stack>
  )
}

// Mensaje de lista vacía del panel central.
export function BoardEmpty({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic', py: 2 }}>
      {children}
    </Typography>
  )
}
