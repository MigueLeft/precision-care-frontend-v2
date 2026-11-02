import { Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useCompletedConsultations } from '@/features/consultations'
import { buildClinicalNotes } from './clinical-notes'
import { ClinicalNoteCard } from './ClinicalNoteCard'
import { LegacyHistoryCard } from './LegacyHistoryCard'

// Pestaña "Notas": la historia del sistema anterior (editable aquí) y el
// texto libre de cada consulta finalizada (se edita en la consulta).
export function ClinicalNotesPanel({ patientId }: { patientId: number }) {
  const consultations = useCompletedConsultations(patientId)
  const entries = buildClinicalNotes(consultations.data ?? [])

  return (
    <QueryBoundary
      isLoading={consultations.isLoading}
      isError={consultations.isError}
      error={consultations.error}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          Historia del sistema anterior (editable) y texto libre de cada consulta finalizada.
        </Typography>
        <LegacyHistoryCard patientId={patientId} />
        {entries.length === 0 && <EmptyState message="Sin notas de consultas registradas." />}
        {entries.map((entry) => (
          <ClinicalNoteCard key={entry.key} entry={entry} />
        ))}
      </Stack>
    </QueryBoundary>
  )
}
