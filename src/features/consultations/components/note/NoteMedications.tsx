import { Box, Chip, Stack, Typography } from '@mui/material'
import { ADHERENCE_LABELS, RAM_LABELS } from '../../utils/consultation-format'
import { NoteEmpty } from './NoteBlock'
import type { ConsultationMedication } from '../../types'

const hasRam = (medication: ConsultationMedication) =>
  !!medication.ramStatus && medication.ramStatus !== 'none'

export function NoteMedications({ medications }: { medications: ConsultationMedication[] }) {
  if (medications.length === 0) return <NoteEmpty />
  return (
    <Stack spacing={0.75}>
      {medications.map((medication) => (
        <Box key={medication.id}>
          <Typography sx={{ fontSize: '13px' }}>
            <Box component="span" sx={{ fontWeight: 600 }}>
              {medication.brandName ?? medication.genericName ?? 'Medicamento'}
            </Box>
            {medication.dose ? ` ${medication.dose}` : ''}
            {medication.frequency ? ` · ${medication.frequency}` : ''}
            {medication.status === 'previous' && (
              <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
                {' '}
                · Finalizado
                {medication.discontinuationReason ? ` (${medication.discontinuationReason})` : ''}
              </Box>
            )}
          </Typography>
          {(medication.adherence || hasRam(medication)) && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.25, flexWrap: 'wrap' }}>
              {medication.adherence && (
                <Chip size="small" label={`Adherencia: ${ADHERENCE_LABELS[medication.adherence]}`} />
              )}
              {medication.ramStatus && hasRam(medication) && (
                <Chip
                  size="small"
                  color={medication.ramStatus === 'confirmed' ? 'error' : 'warning'}
                  label={`RAM: ${RAM_LABELS[medication.ramStatus]}`}
                />
              )}
            </Stack>
          )}
          {(medication.adherenceNotes || medication.ramNotes) && (
            <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}>
              {[medication.adherenceNotes, medication.ramNotes].filter(Boolean).join(' · ')}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  )
}
