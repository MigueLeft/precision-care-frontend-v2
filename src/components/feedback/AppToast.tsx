import type { Ref } from 'react'
import { Alert, AlertTitle } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import type { ToastSeverity } from '@/store/toast.store'

type AppToastProps = {
  severity: ToastSeverity
  title?: string
  message: string
  onClose: () => void
  // La transición del Snackbar necesita la ref del contenido.
  ref?: Ref<HTMLDivElement>
}

const ICONS = {
  success: <CheckCircleRounded fontSize="inherit" />,
  error: <ErrorRounded fontSize="inherit" />,
  warning: <ErrorRounded fontSize="inherit" />,
  info: <InfoRounded fontSize="inherit" />,
}

// Tarjeta oscura con franja lateral e ícono del color del tipo de aviso.
const ToastAlert = styled(Alert)(({ theme }) => ({
  width: 360,
  maxWidth: 'calc(100vw - 32px)',
  alignItems: 'flex-start',
  padding: theme.spacing(1.5, 1.5, 1.5, 2),
  borderRadius: 4,
  // El tema pone un borde gris a todos los Paper; aquí solo va la franja.
  border: 'none',
  borderLeft: '6px solid',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.25)}`,
  '& .MuiAlert-icon': {
    fontSize: 24,
    padding: theme.spacing(0.25, 0),
    marginRight: theme.spacing(1.5),
  },
  '& .MuiAlert-message': { padding: 0, fontSize: '14px', lineHeight: 1.45 },
  '& .MuiAlertTitle-root': { fontSize: '15px', fontWeight: 700, margin: 0, color: 'inherit' },
  '& .MuiAlert-action': { padding: 0, marginRight: 0, alignItems: 'flex-start' },
  '& .MuiAlert-action .MuiIconButton-root': { color: theme.palette.common.white },
}))

export function AppToast({ severity, title, message, onClose, ref }: AppToastProps) {
  return (
    <ToastAlert
      ref={ref}
      severity={severity}
      iconMapping={ICONS}
      onClose={onClose}
      sx={{
        borderLeftColor: `${severity}.main`,
        '& .MuiAlert-icon': { color: `${severity}.main` },
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </ToastAlert>
  )
}
