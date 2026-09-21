import { useState } from 'react'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { formatShortDate } from '@/utils/format-date'
import { useIntakeResponsesByPatient } from '../hooks/useIntakeResponsesByPatient'
import { isInformativeResult } from '../utils/format-result'
import { IntakeResponseDetailDrawer } from './IntakeResponseDetailDrawer'
import { IntakeResultLine } from './IntakeResultLine'
import { SendIntakeDialog } from './SendIntakeDialog'

interface IntakeResponsesPanelProps {
  patientId: number
}

export function IntakeResponsesPanel({
  patientId,
}: IntakeResponsesPanelProps) {
  const { data: responses = [], isLoading, isError, error } =
    useIntakeResponsesByPatient(patientId)
  const [openResponseId, setOpenResponseId] = useState<number | null>(null)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)

  return (
    <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => setSendDialogOpen(true)}
        >
          Enviar ingresable
        </AppButton>
      </Box>

      {responses.length === 0 && (
        <EmptyState message="Sin ingresables asignados." />
      )}

      {responses.map((response) => (
        <Paper key={response.id} sx={{ p: 2.5, borderRadius: '8px' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            {response.completed ? (
              <CheckCircleOutlineIcon sx={{ color: 'success.main', mt: 0.25 }} />
            ) : (
              <PendingOutlinedIcon sx={{ color: 'warning.main', mt: 0.25 }} />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                  {response.intakeName ?? 'Ingresable'}
                </Typography>
                {response.versionNumber !== null && (
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                    v{response.versionNumber}
                  </Typography>
                )}
                <Chip
                  label={response.completed ? 'Completado' : 'Pendiente'}
                  size="small"
                  color={response.completed ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Stack>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.5 }}>
                Asignado: {formatShortDate(response.startAt)}
                {response.completedAt
                  ? ` · Completado: ${formatShortDate(response.completedAt)}`
                  : ''}
              </Typography>
              {response.completed &&
                response.results.filter(isInformativeResult).map((result) => (
                  <Box key={result.mappingId} sx={{ mt: 0.5 }}>
                    <IntakeResultLine {...result} />
                  </Box>
                ))}
            </Box>
            {response.completed ? (
              <AppButton
                size="small"
                variant="outlined"
                onClick={() => setOpenResponseId(response.id)}
              >
                Ver respuestas
              </AppButton>
            ) : (
              <AppButton size="small" variant="outlined" disabled>
                Enviar recordatorio
              </AppButton>
            )}
          </Stack>
        </Paper>
      ))}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
        Los ingresables pendientes se envían al portal del paciente; el especialista también puede
        llenarlos en consulta.
      </Typography>
      </Stack>

      <IntakeResponseDetailDrawer
        responseId={openResponseId}
        open={openResponseId != null}
        onClose={() => setOpenResponseId(null)}
      />
      <SendIntakeDialog
        open={sendDialogOpen}
        patientId={patientId}
        onClose={() => setSendDialogOpen(false)}
      />
    </QueryBoundary>
  )
}
