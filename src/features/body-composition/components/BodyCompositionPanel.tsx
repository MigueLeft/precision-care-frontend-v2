import { useState } from 'react'
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useBodyCompositionsByPatient } from '../hooks/useBodyCompositionsByPatient'
import { getLatestBodyComposition } from '../utils/body-composition-helpers'
import { CurrentMeasurement } from './CurrentMeasurement'
import { HistoryView } from './HistoryView'

interface BodyCompositionPanelProps {
  patientId: number
}

type View = 'current' | 'history'

export function BodyCompositionPanel({ patientId }: BodyCompositionPanelProps) {
  const [view, setView] = useState<View>('current')
  const { data: compositions = [], isLoading, isError, error } =
    useBodyCompositionsByPatient(patientId)

  const latest = getLatestBodyComposition(compositions)

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
          onChange={(_event, next) => next && setView(next as View)}
        >
          <ToggleButton value="current">Medición actual</ToggleButton>
          <ToggleButton value="history">Histórico</ToggleButton>
        </ToggleButtonGroup>
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          disabled
        >
          Nuevo registro
        </AppButton>
      </Stack>

      {view === 'current' &&
        (latest ? (
          <CurrentMeasurement composition={latest} />
        ) : (
          <EmptyState message="Sin mediciones de composición corporal." />
        ))}

      {view === 'history' && <HistoryView compositions={compositions} />}
    </Stack>
  )
}
