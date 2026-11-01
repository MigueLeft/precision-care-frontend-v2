import { Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useCompletedConsultations } from '@/features/consultations'
import { usePatientLegacyHistory } from '@/features/patients'
import { buildClinicalNotes } from './clinical-notes'
import { ClinicalNoteCard } from './ClinicalNoteCard'

// Pestaña "Notas": el texto libre de las consultas finalizadas (motivo,
// enfermedad actual, evolución, planes), sus problemas y lo migrado del
// sistema anterior. Solo lectura; se edita en cada consulta.
export function ClinicalNotesPanel({ patientId }: { patientId: number }) {
  const consultations = useCompletedConsultations(patientId)
  const legacy = usePatientLegacyHistory(patientId)
  const entries = buildClinicalNotes(consultations.data ?? [], legacy.data)

  return (
    <QueryBoundary
      isLoading={consultations.isLoading || legacy.isLoading}
      isError={consultations.isError || legacy.isError}
      error={consultations.error ?? legacy.error}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          Texto libre y problemas de cada consulta finalizada, y la historia traída del sistema
          anterior. Se editan desde la consulta.
        </Typography>
        {entries.length === 0 && <EmptyState message="Sin notas registradas." />}
        {entries.map((entry) => (
          <ClinicalNoteCard key={entry.key} entry={entry} />
        ))}
      </Stack>
    </QueryBoundary>
  )
}
