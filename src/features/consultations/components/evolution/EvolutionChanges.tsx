import { Stack, Typography } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationEvolution } from '../../hooks/useConsultationEvolution'
import {
  BODY_COMPOSITION_PARAMS,
  PHYSICAL_PARAMS,
  changedMeasurements,
  physicalExamSnapshot,
} from '../../utils/measurement-snapshots'
import { DiseaseChanges, MedicationChanges, SymptomChanges } from './ClinicalChanges'
import { MeasurementChanges } from './MeasurementChanges'

type EvolutionChangesProps = {
  consultationId: number
}

const Hint = ({ children }: { children: string }) => (
  <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
    {children}
  </Typography>
)

// Nota evolutiva automática: solo lo que cambió respecto a la consulta anterior
// (tratamiento, diagnósticos, síntomas, examen físico y composición corporal).
export function EvolutionChanges({ consultationId }: EvolutionChangesProps) {
  const { data: evolution, isLoading, isError, error } = useConsultationEvolution(consultationId)

  if (isLoading || isError || !evolution) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  const previous = evolution.previousConsultation
  if (!previous) return <Hint>Primera consulta: no hay una consulta anterior para comparar.</Hint>

  const exam = evolution.physicalExam
  const examChanges = exam
    ? changedMeasurements(
        PHYSICAL_PARAMS,
        exam.before ? physicalExamSnapshot(exam.before) : null,
        physicalExamSnapshot(exam.after),
      )
    : []
  const composition = evolution.bodyComposition
  const compositionChanges = composition
    ? changedMeasurements(BODY_COMPOSITION_PARAMS, composition.before, composition.after)
    : []

  const hasChanges =
    evolution.medications.length +
      evolution.diseases.length +
      evolution.symptoms.length +
      examChanges.length +
      compositionChanges.length >
    0

  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
        Comparada con la consulta del {formatShortDate(previous.startAt)}
        {previous.specialistName ? ` · ${previous.specialistName}` : ''}
      </Typography>
      {!hasChanges && <Hint>Sin cambios respecto a la consulta anterior.</Hint>}
      <MedicationChanges items={evolution.medications} />
      <DiseaseChanges items={evolution.diseases} />
      <SymptomChanges items={evolution.symptoms} />
      <MeasurementChanges title="EXAMEN FÍSICO" items={examChanges} />
      <MeasurementChanges title="COMPOSICIÓN CORPORAL" items={compositionChanges} />
    </Stack>
  )
}
