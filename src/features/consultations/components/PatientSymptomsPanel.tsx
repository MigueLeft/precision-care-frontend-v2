import { Box, Chip, Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { usePatientSymptoms } from '../hooks/usePatientSymptoms'

interface PatientSymptomsPanelProps {
  patientId: number
}

export function PatientSymptomsPanel({ patientId }: PatientSymptomsPanelProps) {
  const { data: entries = [], isLoading, isError, error } = usePatientSymptoms(patientId)

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  if (entries.length === 0) {
    return <EmptyState message="Sin síntomas registrados en las consultas del paciente." />
  }

  return (
    <SectionCard title="Síntomas por consulta">
      <Stack spacing={2.5}>
        {entries.map((entry) => (
          <Box key={entry.consultationId}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary' }}>
              {formatShortDate(entry.date)}
              {entry.specialistName ? ` · ${entry.specialistName}` : ''}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 0.75 }}>
              {entry.symptoms.map((symptom, index) => (
                <Chip
                  key={`${entry.consultationId}-${index}`}
                  size="small"
                  variant="outlined"
                  label={
                    symptom.bodySystemName
                      ? `${symptom.name ?? '—'} · ${symptom.bodySystemName}`
                      : (symptom.name ?? '—')
                  }
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </SectionCard>
  )
}
