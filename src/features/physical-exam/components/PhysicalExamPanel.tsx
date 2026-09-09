import { useState } from 'react'
import { Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { usePhysicalExamsByPatient } from '../hooks/usePhysicalExams'
import { PhysicalExamCurrentView } from './PhysicalExamCurrentView'
import { PhysicalExamHistoryTable } from './PhysicalExamHistoryTable'

interface PhysicalExamPanelProps {
  patientId: number
}

export function PhysicalExamPanel({ patientId }: PhysicalExamPanelProps) {
  const [view, setView] = useState<'current' | 'history'>('current')
  const { data: exams = [], isLoading, isError, error } = usePhysicalExamsByPatient(patientId)

  const latest = exams[0]
  const previous = exams[1]

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_event, next) => next && setView(next)}
        >
          <ToggleButton value="current">
            {latest ? `Consulta actual (${formatShortDate(latest.examDate)})` : 'Consulta actual'}
          </ToggleButton>
          <ToggleButton value="history">Histórico de exámenes</ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title="El examen físico se registra dentro de una consulta.">
          <span>
            <AppButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 16 }} />} disabled>
              Nuevo registro
            </AppButton>
          </span>
        </Tooltip>
      </Stack>

      {!latest && <EmptyState message="Sin exámenes físicos registrados." />}

      {latest && view === 'current' && (
        <PhysicalExamCurrentView exam={latest} previous={previous} />
      )}

      {latest && view === 'history' && (
        <SectionCard title="Histórico de exámenes físicos">
          <PhysicalExamHistoryTable exams={exams} highlightId={latest.id} />
        </SectionCard>
      )}
    </Stack>
  )
}
