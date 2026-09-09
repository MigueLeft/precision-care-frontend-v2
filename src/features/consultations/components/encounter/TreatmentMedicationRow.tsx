import { useState } from 'react'
import {
  Autocomplete,
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
import { useMedications } from '@/features/catalogs'
import type { Medication } from '@/features/catalogs'
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
    replacementMedicationId?: number
  }) => void
}

function catalogLabel(m: Medication) {
  const base = m.brandName || m.genericName
  return m.concentration ? `${base} ${m.concentration}` : base
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
  const suspended = medication.status === 'previous'
  const hasCapture =
    medication.adherence != null ||
    (medication.ramStatus != null && medication.ramStatus !== 'none')

  // Si ya hay captura se muestra el resumen; "Editar" abre los controles.
  const { data: medicationCatalog = [] } = useMedications()

  const [capturing, setCapturing] = useState(!hasCapture && !suspended)
  const [editingMed, setEditingMed] = useState(false)
  const [dose, setDose] = useState(medication.dose ?? '')
  const [frequency, setFrequency] = useState(medication.frequency ?? '')
  const [replacement, setReplacement] = useState<Medication | null>(null)
  const [adherence, setAdherence] = useState<MedicationAdherence | null>(
    medication.adherence ?? null,
  )
  const [ramStatus, setRamStatus] = useState<MedicationRamStatus | null>(
    medication.ramStatus ?? null,
  )
  const [adherenceNotes, setAdherenceNotes] = useState(medication.adherenceNotes ?? '')
  const [ramNotes, setRamNotes] = useState(medication.ramNotes ?? '')

  const doseChanged = editingMed && dose.trim() !== (medication.dose ?? '')
  const freqChanged = editingMed && frequency.trim() !== (medication.frequency ?? '')
  const medChanged =
    editingMed && replacement != null && replacement.id !== medication.medicationId
  const canSave =
    !readOnly &&
    (adherence !== null || ramStatus !== null || doseChanged || freqChanged || medChanged)

  function save() {
    onSave({
      dose: doseChanged ? dose.trim() : undefined,
      frequency: freqChanged ? frequency.trim() : undefined,
      adherence: adherence ?? undefined,
      adherenceNotes: adherence ? adherenceNotes.trim() || undefined : undefined,
      ramStatus: ramStatus ?? undefined,
      ramNotes: ramStatus && ramStatus !== 'none' ? ramNotes.trim() || undefined : undefined,
      replacementMedicationId: medChanged ? replacement!.id : undefined,
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
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
        <Box>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: suspended ? 'error.main' : 'text.primary' }}>
            {medname(medication)}
          </Typography>
          {editingMed ? (
            <Stack spacing={1} sx={{ mt: 0.5 }}>
              <Stack direction="row" spacing={1}>
                <TextField size="small" label="Dosis" value={dose} onChange={(e) => setDose(e.target.value)} />
                <TextField
                  size="small"
                  label="Frecuencia"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </Stack>
              <Autocomplete
                size="small"
                options={medicationCatalog.filter((m) => m.active)}
                getOptionLabel={catalogLabel}
                value={replacement}
                onChange={(_e, value) => setReplacement(value)}
                sx={{ minWidth: 260 }}
                renderInput={(params) => (
                  <TextField {...params} label="Reemplazar por otro medicamento (opcional)" />
                )}
              />
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {medication.dose ?? '—'} · {medication.frequency ?? '—'}
            </Typography>
          )}
        </Box>
        {!readOnly && !suspended && (
          <AppButton
            size="small"
            variant="text"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            onClick={() => setEditingMed((prev) => !prev)}
          >
            {editingMed ? 'Cancelar' : 'Editar / reemplazar'}
          </AppButton>
        )}
      </Stack>

      {suspended && (
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'error.main', mt: 0.5 }}>
          Suspendido por RAM confirmado
          {medication.ramNotes ? ` · ${medication.ramNotes}` : ''}
        </Typography>
      )}

      {/* Resumen simplificado de la captura ya guardada */}
      {!suspended && hasCapture && !capturing && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mt: 1, flexWrap: 'wrap', alignItems: 'center' }}
        >
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
          {!readOnly && (
            <AppButton
              size="small"
              variant="text"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />}
              onClick={() => setCapturing(true)}
            >
              Editar
            </AppButton>
          )}
        </Stack>
      )}

      {/* Controles de captura */}
      {!readOnly && !suspended && capturing && (
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

          <Stack direction="row" spacing={1}>
            <AppButton
              variant="contained"
              size="small"
              loading={isSaving}
              disabled={!canSave}
              onClick={save}
            >
              Guardar
            </AppButton>
            {hasCapture && (
              <AppButton size="small" variant="text" onClick={() => setCapturing(false)}>
                Cancelar
              </AppButton>
            )}
          </Stack>
        </Stack>
      )}
    </Box>
  )
}
