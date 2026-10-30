import { useState, type ReactNode } from 'react'
import { Collapse, Paper, Stack, Typography } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { AppButton } from '@/components/AppButton'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { EvolutionChanges } from '../evolution/EvolutionChanges'
import { AutosaveTextField } from '../encounter/AutosaveTextField'
import { ConsultationReasonField } from '../encounter/ConsultationReasonField'
import { ProblemsSection } from '../encounter/ProblemsSection'
import { sectionNumber } from './workspace-sections'
import type { Consultation } from '../../types'

type NotesPanelProps = {
  consultation: Consultation
  readOnly: boolean
}

function NoteField({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{title}</Typography>
        {action}
      </Stack>
      {children}
    </div>
  )
}

// Notas de la consulta: todos los campos de texto libre y los Problemas.
export function NotesPanel({ consultation, readOnly }: NotesPanelProps) {
  const update = useUpdateConsultation(consultation.id)
  const [showChanges, setShowChanges] = useState(false)

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
        <Stack spacing={2.5}>
          <ConsultationReasonField consultation={consultation} readOnly={readOnly} />
          <NoteField title="Enfermedad actual">
            <AutosaveTextField
              value={consultation.currentIllness ?? ''}
              onSave={(currentIllness) => update.mutate({ currentIllness })}
              draftKey="currentIllness"
              disabled={readOnly}
              minRows={3}
            />
          </NoteField>
          <NoteField
            title="Nota evolutiva"
            action={
              <AppButton
                size="small"
                variant="text"
                startIcon={<CompareArrowsIcon sx={{ fontSize: 16 }} />}
                onClick={() => setShowChanges((prev) => !prev)}
              >
                {showChanges ? 'Ocultar cambios' : 'Ver cambios'}
              </AppButton>
            }
          >
            <Collapse in={showChanges} unmountOnExit>
              <Paper variant="outlined" sx={{ p: 1.5, mb: 1, borderRadius: '8px' }}>
                <EvolutionChanges consultationId={consultation.id} physicalExam={consultation.physicalExam} />
              </Paper>
            </Collapse>
            <AutosaveTextField
              value={consultation.evolution ?? ''}
              onSave={(evolution) => update.mutate({ evolution })}
              draftKey="evolution"
              disabled={readOnly}
              minRows={6}
            />
          </NoteField>
          <NoteField title="Plan de tratamiento">
            <AutosaveTextField
              value={consultation.treatmentPlan ?? ''}
              onSave={(treatmentPlan) => update.mutate({ treatmentPlan })}
              draftKey="treatmentPlan"
              disabled={readOnly}
              minRows={4}
            />
          </NoteField>
          <NoteField title="Plan de estudio">
            <AutosaveTextField
              placeholder="Estudios, interconsultas y seguimiento a solicitar…"
              value={consultation.diagnosticPlan ?? ''}
              onSave={(diagnosticPlan) => update.mutate({ diagnosticPlan })}
              draftKey="diagnosticPlan"
              disabled={readOnly}
              minRows={4}
            />
          </NoteField>
        </Stack>
      </Paper>
      <ProblemsSection index={sectionNumber('problems')} consultation={consultation} readOnly={readOnly} />
    </Stack>
  )
}
