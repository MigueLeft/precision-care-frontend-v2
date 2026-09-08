import { useState } from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationsByPatient } from '../hooks/useConsultationsByPatient'
import { ConsultationDetail } from './ConsultationDetail'

interface ConsultationsPanelProps {
  patientId: number
}

export function ConsultationsPanel({ patientId }: ConsultationsPanelProps) {
  const { data: consultations = [], isLoading, isError, error } =
    useConsultationsByPatient(patientId)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  if (consultations.length === 0) {
    return <EmptyState message="Sin consultas registradas." />
  }

  const selected =
    consultations.find((c) => c.id === selectedId) ?? consultations[0]

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
      <Paper sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
            {consultations.length} consultas
          </Typography>
          <AppButton
            size="small"
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            disabled
          >
            Nueva
          </AppButton>
        </Stack>
        <Stack spacing={0.5}>
          {consultations.map((consultation) => {
            const isActive = consultation.id === selected.id
            return (
              <Box
                key={consultation.id}
                onClick={() => setSelectedId(consultation.id)}
                sx={{
                  p: 1.25,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  borderLeft: '2px solid',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  '&:hover': { bgcolor: isActive ? 'action.selected' : 'action.hover' },
                }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                  {formatShortDate(consultation.startAt)}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }} noWrap>
                  {consultation.consultationReason ?? 'Consulta'}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Paper>

      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <ConsultationDetail consultation={selected} />
      </Box>
    </Stack>
  )
}
