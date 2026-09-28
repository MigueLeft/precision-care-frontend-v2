import { Stack, Typography } from '@mui/material'
import { useConsultationRecorded } from '../../hooks/useConsultationDetail'
import { formatConsultationReason } from '../../utils/consultation-format'
import { NoteBlock, NoteEmpty, NoteText } from './NoteBlock'
import { NoteDiseases, NoteSymptoms } from './NoteClinicalLists'
import { NoteMedications } from './NoteMedications'
import { NoteMeasurements } from './NoteMeasurements'
import { NotePrescriptions } from './NotePrescriptions'
import type { Consultation } from '../../types'

type ConsultationNoteProps = {
  consultation: Consultation
}

// Nota generada por el sistema con todo lo registrado en una consulta. Se usa
// en el expediente (Consultas) y como "Nota de la consulta anterior".
export function ConsultationNote({ consultation }: ConsultationNoteProps) {
  const { data: recorded } = useConsultationRecorded(consultation.id)
  const diagnosisNotes = consultation.problems?.actuales ?? []

  return (
    <Stack spacing={2.5}>
      <NoteBlock title="MOTIVO DE CONSULTA">
        <NoteText value={formatConsultationReason(consultation)} />
      </NoteBlock>
      <NoteBlock title="SÍNTOMAS">
        <NoteSymptoms symptoms={recorded?.symptoms ?? []} />
      </NoteBlock>
      <NoteBlock title="TRATAMIENTO">
        <NoteMedications medications={recorded?.medications ?? []} />
      </NoteBlock>
      <NoteBlock title="DIAGNÓSTICOS">
        <NoteDiseases diseases={recorded?.diseases ?? []} />
      </NoteBlock>
      <NoteMeasurements consultationId={consultation.id} />
      <NoteBlock title="ENFERMEDAD ACTUAL">
        <NoteText value={consultation.currentIllness} />
      </NoteBlock>
      <NoteBlock title="PLAN DE ESTUDIO">
        <NoteText value={consultation.diagnosticPlan} />
      </NoteBlock>
      <NoteBlock title="NOTAS DE DIAGNÓSTICOS">
        {diagnosisNotes.length === 0 ? (
          <NoteEmpty />
        ) : (
          <Stack component="ul" sx={{ m: 0, pl: 2.5 }}>
            {diagnosisNotes.map((note, index) => (
              <Typography component="li" key={`${index}-${note}`} sx={{ fontSize: '13px' }}>
                {note}
              </Typography>
            ))}
          </Stack>
        )}
      </NoteBlock>
      <NoteBlock title="NOTA EVOLUTIVA">
        <NoteText value={consultation.evolution} />
      </NoteBlock>
      <NoteBlock title="PLAN DE TRATAMIENTO">
        <NoteText value={consultation.treatmentPlan} />
      </NoteBlock>
      <NoteBlock title="PRESCRIPCIONES">
        <NotePrescriptions consultationId={consultation.id} />
      </NoteBlock>
    </Stack>
  )
}
