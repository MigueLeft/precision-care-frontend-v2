import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { formatShortDate } from '@/utils/format-date'
import { useDeliverablesByPatient } from '../hooks/useDeliverablesByPatient'
import {
  DELIVERABLE_TYPE_LABELS,
  formatDeliverableTitle,
  isViewableUrl,
} from '../utils/deliverable-format'

interface DeliverablesPanelProps {
  patientId: number
}

export function DeliverablesPanel({ patientId }: DeliverablesPanelProps) {
  const { data: deliverables = [], isLoading, isError, error } =
    useDeliverablesByPatient(patientId)

  return (
    <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          disabled
        >
          Generar entregable
        </AppButton>
      </Box>

      {deliverables.length === 0 && (
        <EmptyState message="Sin entregables generados." />
      )}

      {deliverables.map((deliverable) => {
        const viewable = isViewableUrl(deliverable.pdfS3Key)
        return (
          <Paper key={deliverable.id} sx={{ p: 2.5, borderRadius: '8px' }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <DescriptionOutlinedIcon sx={{ color: 'text.secondary' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                  {formatDeliverableTitle(deliverable)}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {formatShortDate(deliverable.generatedAt)}
                  </Typography>
                  {deliverable.type && (
                    <Chip label={DELIVERABLE_TYPE_LABELS[deliverable.type]} size="small" />
                  )}
                  <Chip
                    label={deliverable.signed ? 'Firmado' : 'Pendiente de firma'}
                    size="small"
                    color={deliverable.signed ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Stack>
              </Box>
              <AppButton
                size="small"
                variant="outlined"
                startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                disabled={!viewable}
                onClick={() => {
                  if (viewable && deliverable.pdfS3Key) {
                    window.open(deliverable.pdfS3Key, '_blank', 'noopener')
                  }
                }}
              >
                Ver
              </AppButton>
            </Stack>
          </Paper>
        )
      })}
      </Stack>
    </QueryBoundary>
  )
}
