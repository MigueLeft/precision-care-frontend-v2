import { useState } from 'react'
import {
  Box,
  Chip,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AppButton } from '@/components/AppButton'
import {
  ADHERENCE_COLORS,
  ADHERENCE_LABELS,
  RAM_COLORS,
  RAM_LABELS,
} from '../../utils/consultation-format'
import type {
  ConsultationMedication,
  MedicationAdherence,
  MedicationRamStatus,
} from '../../types'

interface TreatmentMedicationRowProps {
  medication: ConsultationMedication
  readOnly: boolean
  isSaving: boolean
  onSave: (input: {
    dose?: string
    frequency?: string
    adherence?: MedicationAdherence
    adherenceNotes?: string
    ramStatus?: MedicationRamStatus
    ramNotes?: string
  }) => void
}

const ADHERENCES: MedicationAdherence[] = ['good', 'partial', 'poor']
const RAMS: MedicationRamStatus[] = ['none', 'suspected', 'confirmed']

function medname(m: ConsultationMedication) {
  const base = m.brandName ?? m.genericName ?? 'Medicamento'
  return m.concentration ? `${base} ${m.concentration}` : base
}

export function TreatmentMedicationRow({
  medication,
  readOnly,
  isSaving,
  onSave,
}: TreatmentMedicationRowProps) {
  const [editing, setEditing] = useState(false)
  const [dose, setDose] = useState(medication.dose ?? '')
  const [frequency, setFrequency] = useState(medication.frequency ?? '')
  const [adherence, setAdherence] = useState<MedicationAdherence | null>(null)
  const [ramStatus, setRamStatus] = useState<MedicationRamStatus | null>(null)
  const [adherenceNotes, setAdherenceNotes] = useState('')
  const [ramNotes, setRamNotes] = useState('')

  // Suspendido por RAM confirmado en esta consulta: se muestra en rojo y sin captura.
  const suspended = medication.status === 'previous'
  // Lo que ya quedó registrado para este medicamento en esta consulta.
  const hasCapture =
    medication.adherence != null || (medication.ramStatus != null && medication.ramStatus !== 'none')

  const doseChanged = editing && dose.trim() !== (medication.dose ?? '')
  const freqChanged = editing && frequency.trim() !== (medication.frequency ?? '')
  const canSave =
    !readOnly && (adherence !== null || ramStatus !== null || doseChanged || freqChanged)

  function save() {
    onSave({
      dose: doseChanged ? dose.trim() : undefined,
      frequency: freqChanged ? frequency.trim() : undefined,
      adherence: adherence ?? undefined,
      adherenceNotes: adherence ? adherenceNotes.trim() || undefined : undefined,
      ramStatus: ramStatus ?? undefined,
      ramNotes: ramStatus && ramStatus !== 'none' ? ramNotes.trim() || undefined : undefined,
    })
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: suspended ? 'error.main' : 'divider',
        borderRadius: 1.5,
        p: 1.5,
        bgcolor: suspended ? (theme) => theme.palette.error.light + '14' : 'transparent',
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: suspended ? 'error.main' : 'text.primary' }}>
          {medname(medication)}
        </Typography>
        {!readOnly && !suspended && (
          <AppButton
            size="small"
            variant="text"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? 'Cancelar' : 'Editar'}
          </AppButton>
        )}
      </Stack>

      {editing ? (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TextField size="small" label="Dosis" value={dose} onChange={(e) => setDose(e.target.value)} />
          <TextField
            size="small"
            label="Frecuencia"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            fullWidth
          />
        </Stack>
      ) : (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          {medication.dose ?? '—'} · {medication.frequency ?? '—'}
        </Typography>
      )}

      {suspended && (
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'error.main', mt: 0.5 }}>
          Suspendido por RAM confirmado
          {medication.ramNotes ? ` · ${medication.ramNotes}` : ''}
        </Typography>
      )}

      {!suspended && hasCapture && (
        <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
            Registrado en esta consulta:
          </Typography>
          {medication.adherence && (
            <Chip
              size="small"
              color={ADHERENCE_COLORS[medication.adherence]}
              label={`Adherencia: ${ADHERENCE_LABELS[medication.adherence]}`}
            />
          )}
          {medication.ramStatus && medication.ramStatus !== 'none' && (
            <Chip
              size="small"
              color={RAM_COLORS[medication.ramStatus]}
              label={`RAM: ${RAM_LABELS[medication.ramStatus]}`}
            />
          )}
          {(medication.adherenceNotes || medication.ramNotes) && (
            <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: 'text.secondary', width: '100%' }}>
              {[medication.adherenceNotes, medication.ramNotes].filter(Boolean).join(' · ')}
            </Typography>
          )}
        </Stack>
      )}

      {!readOnly && !suspended && (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>Adherencia</Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={adherence}
              onChange={(_e, value: MedicationAdherence | null) => setAdherence(value)}
            >
              {ADHERENCES.map((value) => (
                <ToggleButton key={value} value={value}>
                  {ADHERENCE_LABELS[value]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {adherence && (
              <TextField
                size="small"
                fullWidth
                placeholder="Notas de adherencia…"
                value={adherenceNotes}
                onChange={(e) => setAdherenceNotes(e.target.value)}
                sx={{ mt: 0.75 }}
              />
            )}
          </Box>

          <Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>
              RAM — Reacción adversa
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={ramStatus}
              onChange={(_e, value: MedicationRamStatus | null) => setRamStatus(value)}
            >
              {RAMS.map((value) => (
                <ToggleButton
                  key={value}
                  value={value}
                  color={value === 'confirmed' ? 'error' : undefined}
                >
                  {RAM_LABELS[value]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {ramStatus && ramStatus !== 'none' && (
              <TextField
                size="small"
                fullWidth
                placeholder="Notas de la RAM…"
                value={ramNotes}
                onChange={(e) => setRamNotes(e.target.value)}
                sx={{ mt: 0.75 }}
              />
            )}
            {ramStatus === 'confirmed' && (
              <Typography sx={{ fontSize: '11px', color: 'error.main', mt: 0.5 }}>
                Al guardar, el medicamento queda suspendido por RAM confirmado (se muestra en rojo).
              </Typography>
            )}
          </Box>

          <AppButton
            variant="contained"
            size="small"
            loading={isSaving}
            disabled={!canSave}
            onClick={save}
            sx={{ alignSelf: 'flex-start' }}
          >
            Guardar
          </AppButton>
        </Stack>
      )}
    </Box>
  )
}
