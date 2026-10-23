import { Alert, Stack, Typography } from '@mui/material'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { AppButton } from '@/components/AppButton'
import {
  useGenerateNutritionRecallReport,
  useResendNutritionRecallReport,
} from '../hooks/useNutritionRecallMutations'
import type { NutritionRecallDetail } from '../types'

type NutritionRecallReportActionsProps = {
  recall: NutritionRecallDetail
}

// Generar el reporte desde la transcripción (o regenerarlo) y reenviar el PDF.
// El reporte se envía a los destinatarios elegidos al mandar el recordatorio.
export function NutritionRecallReportActions({ recall }: NutritionRecallReportActionsProps) {
  const generate = useGenerateNutritionRecallReport(recall.patientId)
  const resend = useResendNutritionRecallReport(recall.patientId)
  const busy = generate.isPending || resend.isPending
  const hasReport = !!recall.reportMarkdown

  return (
    <Stack spacing={1.5}>
      {!hasReport && (
        <Alert severity="info">
          El paciente terminó la entrevista. Genera su reporte nutricional a partir de la transcripción;
          al terminar se envía el PDF por correo.
        </Alert>
      )}
      {recall.reportStatus && recall.reportStatus !== 'sent' && recall.reportError && (
        <Alert severity="warning">Último intento: {recall.reportError}</Alert>
      )}
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
        <AppButton
          variant={hasReport ? 'outlined' : 'contained'}
          startIcon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />}
          loading={generate.isPending}
          disabled={busy}
          onClick={() => generate.mutate(recall.id)}
        >
          {hasReport ? 'Regenerar reporte' : 'Generar reporte'}
        </AppButton>
        {hasReport && (
          <AppButton
            variant="outlined"
            startIcon={<SendOutlinedIcon sx={{ fontSize: 18 }} />}
            loading={resend.isPending}
            disabled={busy}
            onClick={() => resend.mutate(recall.id)}
          >
            Reenviar PDF
          </AppButton>
        )}
      </Stack>
      {generate.isPending && (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          Generando el reporte… puede tardar unos minutos. No cierres esta ventana.
        </Typography>
      )}
    </Stack>
  )
}
