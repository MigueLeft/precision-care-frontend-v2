import { Box, Chip, Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatFreeDate, formatShortDate } from '@/utils/format-date'
import { usePatientLegacyHistory, type LegacySymptom } from '@/features/patients'

const label = { fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 0.5 }

function TextBlock({ title, text }: { title: string; text: string | null }) {
  if (!text) return null
  return (
    <Box>
      <Typography sx={label}>{title.toUpperCase()}</Typography>
      <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{text}</Typography>
    </Box>
  )
}

function ProblemList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <Box>
      <Typography sx={label}>{title.toUpperCase()}</Typography>
      <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Chip key={item} size="small" variant="outlined" label={item} />
        ))}
      </Stack>
    </Box>
  )
}

const symptomDetail = (symptom: LegacySymptom) =>
  [symptom.severity, symptom.frequency, symptom.duration, symptom.notes, symptom.reportedAt && formatFreeDate(symptom.reportedAt)]
    .filter(Boolean)
    .join(' · ')

// Lo que el paciente traía en la plataforma anterior (notas en la ficha, no por
// consulta): enfermedad actual, planes, evolución, problemas y síntomas. Solo
// lectura; no aparece si el paciente no viene de ahí.
export function HistoriaAnteriorCard({ patientId }: { patientId: number }) {
  const { data: history } = usePatientLegacyHistory(patientId)
  if (!history) return null

  return (
    <SectionCard
      title="Historia del sistema anterior"
      action={
        history.recordedAt && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            Última actualización: {formatShortDate(history.recordedAt)}
          </Typography>
        )
      }
    >
      <Stack spacing={2}>
        <TextBlock title="Enfermedad actual" text={history.currentIllness} />
        <TextBlock title="Evolución" text={history.evolution} />
        <TextBlock title="Plan diagnóstico" text={history.diagnosticPlan} />
        <TextBlock title="Plan de tratamiento" text={history.treatmentPlan} />
        <ProblemList title="Problemas actuales" items={history.problems?.actuales ?? []} />
        <ProblemList title="Problemas previos" items={history.problems?.previos ?? []} />
        {history.symptoms && history.symptoms.length > 0 && (
          <Box>
            <Typography sx={label}>SÍNTOMAS REPORTADOS</Typography>
            <Stack spacing={0.5}>
              {history.symptoms.map((symptom, index) => (
                <Typography key={`${symptom.name}-${index}`} sx={{ fontSize: '13px' }}>
                  <strong>{symptom.name}</strong>
                  {symptomDetail(symptom) && (
                    <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
                      {symptomDetail(symptom)}
                    </Typography>
                  )}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </SectionCard>
  )
}
