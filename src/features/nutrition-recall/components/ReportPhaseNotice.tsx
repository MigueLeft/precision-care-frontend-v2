import { Alert, AlertTitle, Button, LinearProgress, Stack } from '@mui/material'
import type { ReportPhase } from '../hooks/useNutriBotChat'
import type { PublicNutritionRecall } from '../types'

// El reporte lo genera después el equipo: aquí solo se avisa a dónde llegará.
function doneMessage(recall: PublicNutritionRecall) {
  return recall.sendReportToPatient
    ? 'Tus respuestas quedaron guardadas. Tu reporte nutricional te llegará a tu correo en cuanto tu equipo de Precision Care lo prepare.'
    : 'Tus respuestas quedaron guardadas. Tu equipo de Precision Care preparará tu reporte nutricional y te lo hará llegar.'
}

type ReportPhaseNoticeProps = {
  phase: ReportPhase
  recall: PublicNutritionRecall
  onRetry: () => void
}

// Estado al terminar la entrevista: guardando, listo o error al guardar.
export function ReportPhaseNotice({ phase, recall, onRetry }: ReportPhaseNoticeProps) {
  if (phase.kind === 'interview') return null

  if (phase.kind === 'saving') {
    return (
      <Alert severity="info" icon={false}>
        <AlertTitle>Guardando tus respuestas...</AlertTitle>
        <Stack spacing={1}>
          <LinearProgress />
          No cierres esta ventana todavía.
        </Stack>
      </Alert>
    )
  }

  if (phase.kind === 'done') {
    return (
      <Alert severity="success">
        <AlertTitle>¡Gracias! Terminaste tu Recordatorio de 24 Horas</AlertTitle>
        {doneMessage(recall)}
      </Alert>
    )
  }

  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Reintentar
        </Button>
      }
    >
      <AlertTitle>No pudimos guardar tus respuestas</AlertTitle>
      {phase.detail}
    </Alert>
  )
}
