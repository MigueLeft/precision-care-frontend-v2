import { Alert, AlertTitle, Button, LinearProgress, Stack } from '@mui/material'
import type { ReportPhase } from '../hooks/useNutriBotChat'
import type { PublicNutritionRecall } from '../types'

const STAY_MESSAGE = 'No cierres ni salgas de esta ventana hasta que tu reporte haya sido enviado.'

function sentMessage(recall: PublicNutritionRecall) {
  if (recall.sendReportToPatient && recall.sendReportToDoctor)
    return 'Tu reporte fue enviado a tu correo y a tu equipo de nutrición de Precision Care.'
  if (recall.sendReportToPatient) return 'Tu reporte fue enviado a tu correo.'
  return 'Tu reporte fue enviado a tu equipo de nutrición de Precision Care.'
}

type ReportPhaseNoticeProps = {
  phase: ReportPhase
  recall: PublicNutritionRecall
  onRetry: () => void
}

// Estado del reporte al terminar la entrevista. El paciente nunca ve el
// reporte crudo: solo si se está calculando, si se envió o si falló.
export function ReportPhaseNotice({ phase, recall, onRetry }: ReportPhaseNoticeProps) {
  if (phase.kind === 'interview') return null

  if (phase.kind === 'generating') {
    return (
      <Alert severity="info" icon={false}>
        <AlertTitle>Calculando y enviando tu reporte nutricional...</AlertTitle>
        <Stack spacing={1}>
          <LinearProgress />
          {STAY_MESSAGE}
        </Stack>
      </Alert>
    )
  }

  if (phase.kind === 'done') {
    return phase.status === 'failed' ? (
      <Alert severity="warning">
        No pudimos enviar tu reporte automáticamente, pero tus respuestas quedaron guardadas. Tu equipo de
        Precision Care te lo hará llegar.
      </Alert>
    ) : (
      <Alert severity="success">
        {phase.status === 'sent'
          ? sentMessage(recall)
          : 'Tus respuestas fueron enviadas a tu equipo de nutrición de Precision Care. Ellos te harán llegar tu reporte nutricional.'}
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
      <AlertTitle>No pudimos procesar tu reporte</AlertTitle>
      {phase.detail}
    </Alert>
  )
}
