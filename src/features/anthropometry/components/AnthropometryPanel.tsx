import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useAnthropometriesByPatient, useSaveAnthropometry } from '../hooks/useAnthropometry'
import { sortAnthropometries } from '../utils/anthropometry-calculations'
import { AnthropometryCurrentView } from './AnthropometryCurrentView'
import { AnthropometryHistoryView } from './AnthropometryHistoryView'
import { AnthropometryForm } from './AnthropometryForm'
import { historyColumns } from '../utils/history-columns'
import { AnthropometryReportsMenu } from './AnthropometryReportsMenu'

// Antropometría en el expediente: medición actual, histórico y captura/edición.
export function AnthropometryPanel({ patientId }: { patientId: number }) {
  const [view, setView] = useState<'current' | 'history'>('current')
  const [editing, setEditing] = useState<'new' | number | null>(null)
  // Medición seleccionada en el histórico (click en la columna de fecha).
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data = [], isLoading, isError, error } = useAnthropometriesByPatient(patientId)
  const rows = sortAnthropometries(data)
  const [latest, previous] = rows
  const editTarget = typeof editing === 'number' ? rows.find((r) => r.id === editing) : undefined
  const save = useSaveAnthropometry(editTarget?.id, { onSuccess: () => setEditing(null) })
  const editButtonTarget = (selectedId !== null && rows.find((r) => r.id === selectedId)) || latest

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
          {latest && <AnthropometryReportsMenu patientId={patientId} row={latest} />}
          {editButtonTarget && (
            <AppButton
              variant="outlined"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditing(editButtonTarget.id)}
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
          <AnthropometryCurrentView row={latest} previous={previous} />
        ) : (
          <EmptyState message="Sin mediciones de antropometría." />
        ))}

      {view === 'history' && (
        <AnthropometryHistoryView rows={rows} selectedId={selectedId} onSelectRow={setSelectedId} />
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editing === 'new' ? 'Nueva medición de antropometría' : 'Editar medición'}
        </DialogTitle>
        <DialogContent>
          {editing !== null && (
            <AnthropometryForm
              key={editing}
              patientId={patientId}
              existing={editTarget}
              history={historyColumns(rows.filter((row) => row.id !== editTarget?.id))}
              showDate
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
