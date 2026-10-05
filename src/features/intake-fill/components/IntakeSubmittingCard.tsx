import { useEffect } from 'react'
import { CircularProgress, Paper, Typography } from '@mui/material'

// Pantalla que reemplaza al formulario mientras se envían las respuestas.
// Además del aviso, el navegador pide confirmación si el paciente intenta
// cerrar o recargar la página antes de que termine el envío.
export function IntakeSubmittingCard() {
  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [])

  return (
    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '8px' }} role="status" aria-live="polite">
      <CircularProgress size={44} sx={{ mb: 2 }} />
      <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 0.5 }}>
        Enviando tus respuestas…
      </Typography>
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
        Por favor no cierres ni salgas de esta página hasta que termine de cargar.
      </Typography>
    </Paper>
  )
}
