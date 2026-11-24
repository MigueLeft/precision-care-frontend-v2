import { useState } from 'react'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { MedicationDoseFields } from './MedicationDoseFields'
import type { CaptureMedicationInput, ConsultationMedication } from '../../types'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { useMedicationSchedule } from '../../hooks/useMedicationSchedule'

interface BaseMedicationRowProps {
  medication: ConsultationMedication
  readOnly: boolean
  isSaving: boolean
  isRemoving: boolean
  onSave: (input: CaptureMedicationInput) => void
  onRemove: () => void
}

function medname(m: ConsultationMedication) {
  const base = m.brandName ?? m.genericName ?? 'Medicamento'
  return m.concentration ? `${base} ${m.concentration}` : base
}

// Medicamento del tratamiento base (primera consulta): se puede editar la dosis
// y la frecuencia, o quitarlo si se registró por error.
export function BaseMedicationRow({
  medication,
  readOnly,
  isSaving,
  isRemoving,
  onSave,
  onRemove,
}: BaseMedicationRowProps) {
  const [editing, setEditing] = useConsultationDraftState(`baseMedication:${medication.medicationId}.editing`, false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const schedule = useMedicationSchedule(`baseMedication:${medication.medicationId}`, medication)

  function startEditing() {
    schedule.reset()
    setEditing(true)
  }

  function save() {
    onSave(schedule.payload)
    setEditing(false)
  }

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 1.5, py: 1 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography sx={{ fontSize: '14px', flex: 1, minWidth: 0 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {medname(medication)}
          </Box>
          {!editing && (
            <Box component="span" sx={{ color: 'text.secondary' }}>
              {medication.dose ? `  ${medication.dose}` : ''}
              {medication.frequency ? `  ${medication.frequency}` : ''}
              {medication.duration ? ` · ${medication.duration}` : ''}
            </Box>
          )}
        </Typography>
        {!readOnly && !editing && (
          <>
            <Tooltip title="Editar dosis y frecuencia">
              <IconButton size="small" aria-label="Editar medicamento" onClick={startEditing}>
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quitar medicamento">
              <IconButton size="small" aria-label="Quitar medicamento" onClick={() => setConfirmOpen(true)}>
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>

      {!editing && medication.frequencyNotes && <Typography sx={{ fontSize: '12px', color: 'text.secondary', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{medication.frequencyNotes}</Typography>}

      {editing && (
        <Stack spacing={1} sx={{ mt: 1 }}>
          <MedicationDoseFields schedule={schedule} />
          <Stack direction="row" spacing={1}>
            <AppButton size="small" variant="contained" loading={isSaving} disabled={!schedule.changed} onClick={save}>
              Guardar
            </AppButton>
            <AppButton size="small" variant="text" onClick={() => setEditing(false)}>
              Cancelar
            </AppButton>
          </Stack>
        </Stack>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Quitar medicamento"
        description={`¿Quitar ${medname(medication)} del expediente del paciente? Úsalo solo si se registró por error.`}
        confirmLabel="Quitar"
        isConfirming={isRemoving}
        onConfirm={() => {
          onRemove()
          setConfirmOpen(false)
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  )
}
