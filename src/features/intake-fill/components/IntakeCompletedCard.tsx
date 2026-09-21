import { Paper, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'

export function IntakeCompletedCard() {
  return (
    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '8px' }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
      <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 0.5 }}>
        ¡Gracias por completar el formulario!
      </Typography>
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
        Tu médico ya puede ver tus respuestas. Puedes cerrar esta ventana.
      </Typography>
    </Paper>
  )
}
