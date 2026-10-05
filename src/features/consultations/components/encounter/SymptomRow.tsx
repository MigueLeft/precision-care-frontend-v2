import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { OnsetDateField } from './OnsetDateField'
import { SymptomDiseaseLinks } from './SymptomDiseaseLinks'
import { SymptomNotesField } from './SymptomNotesField'
import {
  SYMPTOM_STATUSES,
  SYMPTOM_STATUS_LABELS,
} from '../../utils/consultation-format'
import type {
  CaptureSymptomInput,
  ConsultationDisease,
  ConsultationSymptom,
  SymptomStatus,
} from '../../types'

interface SeverityOption {
  id: number
  name: string
}

interface SymptomRowProps {
  symptom: ConsultationSymptom
  severities: SeverityOption[]
  diseases: ConsultationDisease[]
  readOnly: boolean
  onCapture: (input: CaptureSymptomInput) => void
  onRemove: () => void
}

// Tarjeta de un síntoma: nombre arriba; debajo Severidad, Estado e Inicio (se
// acomodan sin desbordar en laptop), las notas y los diagnósticos asociados con
// su estado.
export function SymptomRow({
  symptom,
  severities,
  diseases,
  readOnly,
  onCapture,
  onRemove,
}: SymptomRowProps) {
  const fieldSx = { flex: '1 1 160px', minWidth: 140 }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        p: 1.25,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>{symptom.name}</Typography>
          {!symptom.capturedHere && (
            <Chip size="small" variant="outlined" label="De consulta previa · revisar" />
          )}
        </Stack>
        {!readOnly && (
          <IconButton size="small" aria-label="Quitar síntoma" onClick={onRemove}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ mt: 1, flexWrap: 'wrap', alignItems: 'flex-start' }}
      >
        <FormControl size="small" sx={fieldSx} disabled={readOnly}>
          <InputLabel id={`sev-${symptom.id}`}>Severidad</InputLabel>
          <Select<number | ''>
            labelId={`sev-${symptom.id}`}
            label="Severidad"
            value={symptom.symptomSeverityId ?? ''}
            onChange={(event) =>
              onCapture({
                symptomSeverityId:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          >
            <MenuItem value="">Sin asignar</MenuItem>
            {severities.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={fieldSx} disabled={readOnly}>
          <InputLabel id={`sta-${symptom.id}`}>Estado</InputLabel>
          <Select<SymptomStatus>
            labelId={`sta-${symptom.id}`}
            label="Estado"
            value={symptom.status}
            onChange={(event) => onCapture({ status: event.target.value as SymptomStatus })}
          >
            {SYMPTOM_STATUSES.map((value) => (
              <MenuItem key={value} value={value}>
                {SYMPTOM_STATUS_LABELS[value]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <OnsetDateField
          value={symptom.onsetDate}
          disabled={readOnly}
          sx={fieldSx}
          onCommit={(onsetDate) => onCapture({ onsetDate })}
        />
      </Stack>

      <SymptomNotesField
        value={symptom.notes}
        disabled={readOnly}
        onCommit={(notes) => onCapture({ notes })}
      />

      <SymptomDiseaseLinks
        links={symptom.diseases}
        patientDiseases={diseases}
        readOnly={readOnly}
        onChange={(next) => onCapture({ diseases: next })}
      />
    </Box>
  )
}
