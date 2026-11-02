import { Chip, Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { NoteText, NoteProblems } from '@/components/ClinicalNoteFields'
import { formatShortDate } from '@/utils/format-date'
import type { ClinicalNoteEntry } from './clinical-notes'

// Una entrada de "Notas": encabezado (fecha, médico) y el texto libre de una
// consulta finalizada.
export function ClinicalNoteCard({ entry }: { entry: ClinicalNoteEntry }) {
  return (
    <SectionCard
      title={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>
            {entry.date ? formatShortDate(entry.date) : 'Sin fecha'}
          </Typography>
          <Chip size="small" label="Consulta" color="primary" />
          {entry.author && (
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{entry.author}</Typography>
          )}
        </Stack>
      }
    >
      <Stack spacing={2}>
        <NoteText title="Motivo de consulta" text={entry.reason} />
        <NoteText title="Enfermedad actual" text={entry.currentIllness} />
        <NoteText title="Evolución" text={entry.evolution} />
        <NoteText title="Plan diagnóstico" text={entry.diagnosticPlan} />
        <NoteText title="Plan de tratamiento" text={entry.treatmentPlan} />
        <NoteProblems title="Problemas actuales" items={entry.problems?.actuales} />
        <NoteProblems title="Problemas previos" items={entry.problems?.previos} />
      </Stack>
    </SectionCard>
  )
}
