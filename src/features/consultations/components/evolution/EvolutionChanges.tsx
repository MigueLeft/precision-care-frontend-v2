import { Stack, Typography } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationEvolution } from '../../hooks/useConsultationEvolution'
import {
  MEASUREMENT_PARAMS,
  anthropometrySnapshot,
  changedMeasurements,
} from '../../utils/measurement-snapshots'
import { DiseaseChanges, MedicationChanges, SymptomChanges } from './ClinicalChanges'
import { MeasurementChanges } from './MeasurementChanges'
import { ParaclinicalChanges } from './ParaclinicalChanges'

type EvolutionChangesProps = {
  consultationId: number
}

const Hint = ({ children }: { children: string }) => (
  <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
    {children}
  </Typography>
)

// Nota evolutiva automática: solo lo que cambió respecto a la consulta anterior
// (tratamiento, diagnósticos, síntomas, antropometría y paraclínicos).
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

  const anthropometry = evolution.anthropometry
  const anthropometryChanges = anthropometry
    ? changedMeasurements(
        MEASUREMENT_PARAMS,
        anthropometry.before ? anthropometrySnapshot(anthropometry.before) : null,
        anthropometrySnapshot(anthropometry.after),
      )
    : []
  const paraclinicals = evolution.paraclinicals ?? []

  const hasChanges =
    evolution.medications.length +
      evolution.diseases.length +
      evolution.symptoms.length +
      anthropometryChanges.length +
      paraclinicals.length >
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
      {/* Antropometría y paraclínicos se muestran siempre, aunque no cambien. */}
      <MeasurementChanges
        title="ANTROPOMETRÍA"
        items={anthropometryChanges}
        emptyText={anthropometry ? 'Sin cambios.' : 'Sin medición en esta consulta.'}
      />
      <ParaclinicalChanges items={paraclinicals} />
    </Stack>
  )
}
