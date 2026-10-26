import { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { AutosaveTextField } from '../encounter/AutosaveTextField'
import { ProblemsList } from '../encounter/ProblemsList'
import type { ClinicalNotesDraft, ConsultationProblems } from '../../types'

type PreloadClinicalNotesProps = {
  // Índice de la primera sección (continúa la numeración de la página).
  startIndex: number
  notes: ClinicalNotesDraft
  onSave: (patch: ClinicalNotesDraft) => void
}

const TEXT_FIELDS: { key: Exclude<keyof ClinicalNotesDraft, 'problems'>; title: string; minRows: number }[] = [
  { key: 'currentIllness', title: 'Enfermedad actual', minRows: 3 },
  { key: 'evolution', title: 'Nota evolutiva', minRows: 6 },
  { key: 'treatmentPlan', title: 'Plan de tratamiento', minRows: 4 },
  { key: 'diagnosticPlan', title: 'Plan de estudio', minRows: 4 },
]

// Notas clínicas precargadas desde la cita, en una sola columna. Al iniciar la
// consulta llenan sus campos vacíos; los problemas se completan ahí con los
// diagnósticos y eventos del expediente.
export function PreloadClinicalNotes({ startIndex, notes, onSave }: PreloadClinicalNotesProps) {
  const [problems, setProblems] = useState<ConsultationProblems>(
    () => notes.problems ?? { actuales: [], previos: [] },
  )
  const [tab, setTab] = useState(0)

  const commit = (next: ConsultationProblems) => {
    setProblems(next)
    onSave({ problems: next })
  }

  return (
    <>
      {TEXT_FIELDS.map((field, i) => (
        <CollapsibleSection key={field.key} title={`${startIndex + i}. ${field.title}`} defaultExpanded>
          <AutosaveTextField
            value={notes[field.key] ?? ''}
            onSave={(value) => onSave({ [field.key]: value })}
            minRows={field.minRows}
          />
        </CollapsibleSection>
      ))}
      <CollapsibleSection title={`${startIndex + TEXT_FIELDS.length}. Problemas`} defaultExpanded>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ mb: 2, minHeight: 34, '& .MuiTab-root': { minHeight: 34, fontSize: '13px' } }}
        >
          <Tab label={`Actuales (${problems.actuales.length})`} />
          <Tab label={`Previos (${problems.previos.length})`} />
        </Tabs>
        <Box hidden={tab !== 0}>
          <ProblemsList
            items={problems.actuales}
            readOnly={false}
            placeholder="Agregar problema…"
            emptyLabel="Sin problemas actuales."
            onChange={(actuales) => commit({ ...problems, actuales })}
          />
        </Box>
        <Box hidden={tab !== 1}>
          <ProblemsList
            items={problems.previos}
            readOnly={false}
            placeholder="Agregar problema previo…"
            emptyLabel="Sin problemas previos."
            onChange={(previos) => commit({ ...problems, previos })}
          />
        </Box>
      </CollapsibleSection>
    </>
  )
}
