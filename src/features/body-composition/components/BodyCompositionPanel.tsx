import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import {
  useBodyCompositionsByPatient,
  useSaveBodyComposition,
} from '../hooks/useBodyComposition'
import { getLatestBodyComposition } from '../utils/body-composition-helpers'
import { CurrentMeasurement } from './CurrentMeasurement'
import { HistoryView } from './HistoryView'
import { BodyCompositionForm } from './BodyCompositionForm'

interface BodyCompositionPanelProps {
  patientId: number
}

export function BodyCompositionPanel({ patientId }: BodyCompositionPanelProps) {
  const [view, setView] = useState<'current' | 'history'>('current')
  const [editing, setEditing] = useState<'new' | number | null>(null)
  const { data: compositions = [], isLoading, isError, error } =
    useBodyCompositionsByPatient(patientId)

  const latest = getLatestBodyComposition(compositions)
  const editTarget =
    typeof editing === 'number'
      ? compositions.find((c) => c.id === editing)
      : undefined
  const save = useSaveBodyComposition(editTarget?.id, {
    onSuccess: () => setEditing(null),
  })

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
          <ToggleButton value="current">Medición actual</ToggleButton>
          <ToggleButton value="history">Histórico</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" spacing={1}>
          {latest && (
            <AppButton
              variant="outlined"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditing(latest.id)}
            >
              Editar medición
            </AppButton>
          )}
          <AppButton
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setEditing('new')}
          >
            Nuevo registro
          </AppButton>
        </Stack>
      </Stack>

      {view === 'current' &&
        (latest ? (
          <CurrentMeasurement composition={latest} />
        ) : (
          <EmptyState message="Sin mediciones de composición corporal." />
        ))}

      {view === 'history' && <HistoryView compositions={compositions} />}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editing === 'new' ? 'Nueva medición de composición corporal' : 'Editar medición'}
        </DialogTitle>
        <DialogContent>
          {editing !== null && (
            <BodyCompositionForm
              key={editing}
              patientId={patientId}
              existing={editTarget}
              isSaving={save.isPending}
              onSave={save.mutate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  )
}
