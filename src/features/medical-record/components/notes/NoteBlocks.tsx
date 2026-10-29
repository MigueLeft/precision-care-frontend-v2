import { Box, Chip, Stack, Typography } from '@mui/material'
import { formatFreeDate } from '@/utils/format-date'
import type { LegacySymptom } from '@/features/patients'

const label = { fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 0.5 }

// Campo de texto libre (se respetan los saltos de línea); vacío no se muestra.
export function NoteText({ title, text }: { title: string; text: string | null | undefined }) {
  if (!text?.trim()) return null
  return (
    <Box>
      <Typography sx={label}>{title.toUpperCase()}</Typography>
      <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{text.trim()}</Typography>
    </Box>
  )
}

export function NoteProblems({ title, items }: { title: string; items: string[] | undefined }) {
  if (!items?.length) return null
  return (
    <Box>
      <Typography sx={label}>{title.toUpperCase()}</Typography>
      <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Chip key={item} size="small" variant="outlined" label={item} />
        ))}
      </Stack>
    </Box>
  )
}

const symptomDetail = (symptom: LegacySymptom) =>
  [symptom.severity, symptom.frequency, symptom.duration, symptom.notes, symptom.reportedAt && formatFreeDate(symptom.reportedAt)]
    .filter(Boolean)
    .join(' · ')

export function NoteSymptoms({ symptoms }: { symptoms: LegacySymptom[] | null | undefined }) {
  if (!symptoms?.length) return null
  return (
    <Box>
      <Typography sx={label}>SÍNTOMAS REPORTADOS</Typography>
      <Stack spacing={0.5}>
        {symptoms.map((symptom, index) => (
          <Typography key={`${symptom.name}-${index}`} sx={{ fontSize: '13px' }}>
            <strong>{symptom.name}</strong>
            {symptomDetail(symptom) && (
              <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
                {symptomDetail(symptom)}
              </Typography>
            )}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}
