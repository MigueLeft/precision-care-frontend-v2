import { useState } from 'react'
import {
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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

// Fila de captura de un síntoma: severidad + estado + enfermedad + inicio.
export function SymptomRow({
  symptom,
  severities,
  diseases,
  readOnly,
  onCapture,
  onRemove,
}: SymptomRowProps) {
  const [onset, setOnset] = useState(symptom.onsetDate ?? '')

  const commitOnset = () => {
    const value = onset.trim()
    if (value !== (symptom.onsetDate ?? '')) onCapture({ onsetDate: value })
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
    >
      <Stack sx={{ flex: 1, minWidth: 140 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{symptom.name}</Typography>
        {!symptom.capturedHere && (
          <Chip
            size="small"
            variant="outlined"
            label="De consulta previa · revisar"
            sx={{ alignSelf: 'flex-start', mt: 0.25 }}
          />
        )}
      </Stack>

      <FormControl size="small" sx={{ minWidth: 130 }} disabled={readOnly}>
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

      <FormControl size="small" sx={{ minWidth: 150 }} disabled={readOnly}>
        <InputLabel id={`sta-${symptom.id}`}>Estado</InputLabel>
        <Select<SymptomStatus>
          labelId={`sta-${symptom.id}`}
          label="Estado"
          value={symptom.status}
          onChange={(event) =>
            onCapture({ status: event.target.value as SymptomStatus })
          }
        >
          {SYMPTOM_STATUSES.map((value) => (
            <MenuItem key={value} value={value}>
              {SYMPTOM_STATUS_LABELS[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 170 }} disabled={readOnly}>
        <InputLabel id={`dis-${symptom.id}`}>Enfermedad</InputLabel>
        <Select<number | ''>
          labelId={`dis-${symptom.id}`}
          label="Enfermedad"
          value={symptom.patientDiseaseId ?? ''}
          onChange={(event) =>
            onCapture({
              patientDiseaseId:
                event.target.value === '' ? null : Number(event.target.value),
            })
          }
        >
          <MenuItem value="">Sin asignar</MenuItem>
          {diseases.map((disease) => (
            <MenuItem key={disease.id} value={disease.id}>
              {disease.name ?? '—'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Inicio"
        placeholder="2026-05 · 2019"
        value={onset}
        disabled={readOnly}
        onChange={(event) => setOnset(event.target.value)}
        onBlur={commitOnset}
        sx={{ width: 120 }}
      />

      {!readOnly && (
        <IconButton size="small" aria-label="Quitar síntoma" onClick={onRemove}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
    </Stack>
  )
}
