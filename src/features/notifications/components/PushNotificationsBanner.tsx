import { useState } from 'react'
import { Alert, AlertTitle, Box } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { usePushNotifications } from '../hooks/usePushNotifications'

const DISMISS_KEY = 'pc-push-banner-dismissed'

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

// Aviso en la agenda para activar las notificaciones (o cómo hacerlo en
// iPhone). Se puede descartar; desde el menú se activan cuando se quiera.
export function PushNotificationsBanner() {
  const { status, enable, busy } = usePushNotifications()
  const [dismissed, setDismissed] = useState(readDismissed)

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* almacenamiento no disponible: solo se oculta en esta sesión */
    }
  }

  if (dismissed || status === 'on' || status === 'unsupported') return null

  return (
    <Box sx={{ px: 2, pt: 1.5 }}>
      {status === 'off' && (
        <Alert
          severity="info"
          onClose={dismiss}
          action={
            <AppButton size="small" variant="contained" loading={busy} onClick={() => enable.mutate()}>
              Activar
            </AppButton>
          }
        >
          Recibe un aviso cuando te confirmen una cita y tu agenda cada mañana.
        </Alert>
      )}
      {status === 'needs-install' && (
        <Alert severity="info" onClose={dismiss}>
          <AlertTitle>Instala la app para recibir avisos</AlertTitle>
          En Safari toca <strong>Compartir</strong> y luego <strong>Agregar a inicio</strong>. Abre la app desde ese
          ícono y activa las notificaciones.
        </Alert>
      )}
      {status === 'blocked' && (
        <Alert severity="warning" onClose={dismiss}>
          Las notificaciones están bloqueadas para esta app. Actívalas en los ajustes del teléfono o del navegador.
        </Alert>
      )}
    </Box>
  )
}
