import type { ReactNode } from 'react'
import { Dialog, Paper, type DialogProps } from '@mui/material'

type DialogSurfaceProps = {
  open: boolean
  // En línea: el contenido se muestra dentro de la página (p. ej. el panel
  // central de la consulta) en lugar de un modal.
  inline?: boolean
  maxWidth?: DialogProps['maxWidth']
  onClose?: () => void
  children: ReactNode
}

// Contenedor de un diálogo que también puede mostrarse en línea. Los
// DialogTitle/DialogContent/DialogActions funcionan igual en ambos casos.
export function DialogSurface({ open, inline, maxWidth = 'md', onClose, children }: DialogSurfaceProps) {
  if (inline) {
    return open ? <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>{children}</Paper> : null
  }
  return (
    <Dialog open={open} maxWidth={maxWidth} fullWidth onClose={onClose}>
      {children}
    </Dialog>
  )
}
