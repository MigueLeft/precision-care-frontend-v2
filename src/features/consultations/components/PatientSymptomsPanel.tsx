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
import type { SymptomStatus } from '../types'

interface PatientSymptomsPanelProps {
  patientId: number
}

interface DateGroupItem {
  symptomCatalogId: number
  name: string | null
  status: SymptomStatus
  severityName: string | null
  diseaseName: string | null
  onsetDate: string | null
  notes: string | null
}

interface DateGroup {
  key: string
  date: string
  items: DateGroupItem[]
}

// Agrupa las versiones de todos los síntomas del paciente por fecha de captura
// (una versión por consulta): qué síntomas se presentaron en cada fecha, con
// su estado y severidad en ese momento.
function groupByDate(
  symptoms: {
    symptomCatalogId: number
    name: string | null
    versions: {
      consultationId: number | null
      status: SymptomStatus
      severityName: string | null
      diseaseName: string | null
      onsetDate: string | null
      notes: string | null
      createdAt: string
    }[]
  }[],
): DateGroup[] {
  const groupsByKey = new Map<string, DateGroup>()

  for (const symptom of symptoms) {
    for (const version of symptom.versions) {
      const key = version.consultationId != null ? `c-${version.consultationId}` : `d-${version.createdAt}`
      let group = groupsByKey.get(key)
      if (!group) {
        group = { key, date: version.createdAt, items: [] }
        groupsByKey.set(key, group)
      }
      group.items.push({
        symptomCatalogId: symptom.symptomCatalogId,
        name: symptom.name,
        status: version.status,
        severityName: version.severityName,
        diseaseName: version.diseaseName,
        onsetDate: version.onsetDate,
        notes: version.notes,
      })
    }
  }

  return Array.from(groupsByKey.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
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

  const groups = groupByDate(symptoms)

  return (
    <Stack spacing={2}>
      {groups.map((group) => (
        <SectionCard
          key={group.key}
          title={<Typography variant="h3">{formatShortDate(group.date)}</Typography>}
        >
          <Stack spacing={1.25}>
            {group.items.map((item, index) => (
              <Box key={`${group.key}-${item.symptomCatalogId}-${index}`}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {item.name ?? '—'}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={SYMPTOM_STATUS_COLORS[item.status]}
                    label={SYMPTOM_STATUS_LABELS[item.status]}
                  />
                  {item.severityName && (
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {item.severityName}
                    </Typography>
                  )}
                  {item.diseaseName && (
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      · {item.diseaseName}
                    </Typography>
                  )}
                  {item.onsetDate && (
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      · inicio {formatFreeDate(item.onsetDate)}
                    </Typography>
                  )}
                </Stack>
                {item.notes && (
                  <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}>
                    {item.notes}
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
