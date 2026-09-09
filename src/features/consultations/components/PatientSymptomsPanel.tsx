import { Box, Chip, Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatFreeDate, formatShortDate } from '@/utils/format-date'
import { usePatientSymptoms } from '../hooks/usePatientSymptoms'
import {
  SYMPTOM_STATUS_COLORS,
  SYMPTOM_STATUS_LABELS,
} from '../utils/consultation-format'

interface PatientSymptomsPanelProps {
  patientId: number
}

export function PatientSymptomsPanel({ patientId }: PatientSymptomsPanelProps) {
  const { data: symptoms = [], isLoading, isError, error } = usePatientSymptoms(patientId)

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  if (symptoms.length === 0) {
    return <EmptyState message="Sin síntomas registrados en las consultas del paciente." />
  }

  return (
    <Stack spacing={2}>
      {symptoms.map((symptom) => (
        <SectionCard
          key={symptom.symptomCatalogId}
          title={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h3">{symptom.name ?? '—'}</Typography>
              <Chip
                size="small"
                variant="outlined"
                color={SYMPTOM_STATUS_COLORS[symptom.status]}
                label={SYMPTOM_STATUS_LABELS[symptom.status]}
              />
              {symptom.severityName && (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {symptom.severityName}
                </Typography>
              )}
              {symptom.diseaseName && (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  · {symptom.diseaseName}
                </Typography>
              )}
            </Stack>
          }
        >
          <Stack spacing={0.75}>
            {symptom.versions.map((version) => (
              <Box key={version.id}>
                <Typography sx={{ fontSize: '13px' }}>
                  <Typography component="span" sx={{ fontWeight: 600 }}>
                    {formatShortDate(version.createdAt)}
                  </Typography>
                  {' · '}
                  {SYMPTOM_STATUS_LABELS[version.status]}
                  {version.severityName ? ` · ${version.severityName}` : ''}
                  {version.diseaseName ? ` · ${version.diseaseName}` : ''}
                  {version.onsetDate ? ` · inicio ${formatFreeDate(version.onsetDate)}` : ''}
                </Typography>
                {version.notes && (
                  <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}>
                    {version.notes}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </SectionCard>
      ))}
    </Stack>
  )
}
