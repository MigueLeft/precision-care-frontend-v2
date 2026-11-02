import { Chip, Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { NoteProblems, NoteSymptoms, NoteText } from '@/components/ClinicalNoteFields'
import { useCan } from '@/features/identity'
import { usePatientLegacyHistory, useUpdatePatientLegacyHistory } from '@/features/patients'
import { AutosaveField } from './AutosaveField'

const FIELDS = [
  { key: 'currentIllness', label: 'Enfermedad actual', minRows: 3 } as const,
  { key: 'evolution', label: 'Nota evolutiva', minRows: 6 } as const,
  { key: 'diagnosticPlan', label: 'Plan diagnóstico', minRows: 3 } as const,
  { key: 'treatmentPlan', label: 'Plan de tratamiento', minRows: 3 } as const,
]

// Historia del sistema anterior: sus 4 campos de texto se cargan/editan aquí
// (con permiso para editar consultas); problemas y síntomas solo vienen de la
// migración. Sin permiso de edición y sin nada migrado, no se muestra.
export function LegacyHistoryCard({ patientId }: { patientId: number }) {
  const { data: legacy, isLoading } = usePatientLegacyHistory(patientId)
  const update = useUpdatePatientLegacyHistory(patientId)
  const { can } = useCan()
  const canEdit = can('consultas:update')

  if (isLoading) return null

  const hasProblems = (legacy?.problems?.actuales.length ?? 0) + (legacy?.problems?.previos.length ?? 0) > 0
  const hasSymptoms = (legacy?.symptoms?.length ?? 0) > 0
  const hasText = FIELDS.some((field) => legacy?.[field.key]?.trim())

  if (!canEdit && !hasText && !hasProblems && !hasSymptoms) return null

  return (
    <SectionCard
      title={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>Historia del sistema anterior</Typography>
          <Chip size="small" label="Sistema anterior" variant="outlined" />
        </Stack>
      }
    >
      <Stack spacing={2}>
        {canEdit
          ? FIELDS.map((field) => (
              <AutosaveField
                key={field.key}
                label={field.label}
                value={legacy?.[field.key] ?? ''}
                minRows={field.minRows}
                onSave={(value) => update.mutate({ [field.key]: value })}
              />
            ))
          : FIELDS.map((field) => (
              <NoteText key={field.key} title={field.label} text={legacy?.[field.key]} />
            ))}
        <NoteProblems title="Problemas actuales" items={legacy?.problems?.actuales} />
        <NoteProblems title="Problemas previos" items={legacy?.problems?.previos} />
        <NoteSymptoms symptoms={legacy?.symptoms} />
      </Stack>
    </SectionCard>
  )
}
