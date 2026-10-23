import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import MailOutlineIcon from '@mui/icons-material/EmailOutlined'
import { AppButton } from '@/components/AppButton'
import { copyIntakeLink } from '@/features/intake-responses'
import { formatShortDate } from '@/utils/format-date'
import { useSendNutritionRecallEmail } from '../hooks/useNutritionRecallMutations'
import type { NutritionRecall, NutritionRecallReportStatus } from '../types'

const REPORT_STATUS_TEXT: Record<NutritionRecallReportStatus, string> = {
  sent: 'Reporte PDF enviado',
  backup: 'El PDF no se pudo generar: transcripción enviada al equipo',
  failed: 'No se pudo enviar el reporte por correo',
}

// Completado sin estado = el reporte aún no se genera (lo genera el equipo).
function reportStatusText(recall: NutritionRecall) {
  if (!recall.completed) return null
  return recall.reportStatus ? REPORT_STATUS_TEXT[recall.reportStatus] : 'Reporte pendiente de generar'
}

type NutritionRecallItemProps = {
  recall: NutritionRecall
  onViewReport: (id: number) => void
}

export function NutritionRecallItem({ recall, onViewReport }: NutritionRecallItemProps) {
  const sendEmail = useSendNutritionRecallEmail()
  const statusText = reportStatusText(recall)

  return (
    <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        {recall.completed ? (
          <CheckCircleOutlineIcon sx={{ color: 'success.main', mt: 0.25 }} />
        ) : (
          <PendingOutlinedIcon sx={{ color: 'warning.main', mt: 0.25 }} />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Recordatorio de 24 Horas</Typography>
            <Chip
              label={recall.completed ? 'Completado' : 'Pendiente'}
              size="small"
              color={recall.completed ? 'success' : 'warning'}
              variant="outlined"
            />
          </Stack>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.5 }}>
            Asignado: {formatShortDate(recall.startAt)}
            {recall.completedAt ? ` · Completado: ${formatShortDate(recall.completedAt)}` : ''}
          </Typography>
          {statusText && (
            <Typography
              sx={{ fontSize: '12px', mt: 0.5, color: recall.reportStatus === 'sent' ? 'text.secondary' : 'warning.main' }}
            >
              {statusText}
            </Typography>
          )}
        </Box>
        {recall.completed ? (
          <AppButton size="small" variant="outlined" onClick={() => onViewReport(recall.id)}>
            {recall.reportStatus === 'sent' ? 'Ver reporte' : 'Ver y generar reporte'}
          </AppButton>
        ) : (
          <Stack direction="row" spacing={1}>
            <AppButton
              size="small"
              variant="outlined"
              startIcon={<ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />}
              disabled={!recall.link}
              onClick={() => recall.link && void copyIntakeLink(recall.link)}
            >
              Copiar enlace
            </AppButton>
            <AppButton
              size="small"
              variant="outlined"
              startIcon={<MailOutlineIcon sx={{ fontSize: 16 }} />}
              loading={sendEmail.isPending}
              onClick={() => sendEmail.mutate(recall.id)}
            >
              Enviar por correo
            </AppButton>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}
