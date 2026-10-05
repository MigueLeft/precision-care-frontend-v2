import { Chip, Stack, Typography } from '@mui/material'
import {
  DISEASE_STATUS_COLORS,
  DISEASE_STATUS_LABELS,
  SYMPTOM_STATUS_LABELS,
  formatSymptomDiseases,
} from '../../utils/consultation-format'
import { NoteEmpty } from './NoteBlock'
import type { ConsultationDisease, ConsultationSymptom } from '../../types'

export function NoteSymptoms({ symptoms }: { symptoms: ConsultationSymptom[] }) {
  if (symptoms.length === 0) return <NoteEmpty />
  return (
    <Stack spacing={0.5}>
      {symptoms.map((symptom) => (
        <Typography key={symptom.id} sx={{ fontSize: '13px' }}>
          <strong>{symptom.name ?? '—'}</strong>
          {[symptom.severityName, SYMPTOM_STATUS_LABELS[symptom.status]]
            .filter(Boolean)
            .map((part) => ` · ${part}`)
            .join('')}
          {symptom.diseases.length > 0 && (
            <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {' '}
              — {formatSymptomDiseases(symptom.diseases)}
            </Typography>
          )}
          {symptom.notes && (
            <Typography
              component="span"
              sx={{ display: 'block', fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}
            >
              {symptom.notes}
            </Typography>
          )}
        </Typography>
      ))}
    </Stack>
  )
}

export function NoteDiseases({ diseases }: { diseases: ConsultationDisease[] }) {
  if (diseases.length === 0) return <NoteEmpty />
  return (
    <Stack spacing={0.5}>
      {diseases.map((disease) => (
        <Stack key={disease.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{disease.name ?? '—'}</Typography>
          {disease.code && (
            <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{disease.code}</Typography>
          )}
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {disease.bodySystemName ?? ''}
          </Typography>
          <Chip
            size="small"
            label={DISEASE_STATUS_LABELS[disease.status]}
            color={DISEASE_STATUS_COLORS[disease.status]}
          />
        </Stack>
      ))}
    </Stack>
  )
}
