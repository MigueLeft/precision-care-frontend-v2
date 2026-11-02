import { Stack, Typography } from '@mui/material'
import { NoteProblems, NoteSymptoms, NoteText } from '@/components/ClinicalNoteFields'
import { usePatientLegacyHistory } from '../hooks/usePatientLegacyHistory'

// Historia del sistema anterior, de solo lectura: referencia dentro de la
// consulta (se edita desde la pestaña Notas del expediente).
export function PatientLegacyHistorySummary({ patientId }: { patientId: number }) {
  const { data: legacy } = usePatientLegacyHistory(patientId)
  if (!legacy) return null

  const hasText = [legacy.currentIllness, legacy.evolution, legacy.diagnosticPlan, legacy.treatmentPlan].some(
    (text) => text?.trim(),
  )
  const hasProblems = (legacy.problems?.actuales.length ?? 0) + (legacy.problems?.previos.length ?? 0) > 0
  const hasSymptoms = (legacy.symptoms?.length ?? 0) > 0
  if (!hasText && !hasProblems && !hasSymptoms) return null

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Historia del sistema anterior</Typography>
      <NoteText title="Enfermedad actual" text={legacy.currentIllness} />
      <NoteText title="Evolución" text={legacy.evolution} />
      <NoteText title="Plan diagnóstico" text={legacy.diagnosticPlan} />
      <NoteText title="Plan de tratamiento" text={legacy.treatmentPlan} />
      <NoteProblems title="Problemas actuales" items={legacy.problems?.actuales} />
      <NoteProblems title="Problemas previos" items={legacy.problems?.previos} />
      <NoteSymptoms symptoms={legacy.symptoms} />
    </Stack>
  )
}
