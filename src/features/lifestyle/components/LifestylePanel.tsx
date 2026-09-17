import { Stack } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useIntakeResponsesByPatient, useIntakeResponseDetail } from '@/features/intake-responses'
import { useLifestyleByPatient } from '../hooks/useLifestyleByPatient'
import { buildMockLifestyleAssessment } from '../utils/lifestyle-mock'
import { LifeEssential8Card } from './LifeEssential8Card'
import { ClinicalRiskScoresCard } from './ClinicalRiskScoresCard'

interface LifestylePanelProps {
  patientId: number
}

export function LifestylePanel({ patientId }: LifestylePanelProps) {
  const { data: evaluations = [], isLoading, isError, error } =
    useLifestyleByPatient(patientId)
  const latest = evaluations[0]

  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const latestCompletedResponse = responses.find((r) => r.completed)
  const { data: responseDetail } = useIntakeResponseDetail(latestCompletedResponse?.id ?? null)
  const clinicalScores = (responseDetail?.results ?? []).filter(
    (r) => r.destinationType === 'custom' && r.destinationField,
  )

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  // Aún no existe captura real; mientras tanto se muestra el diseño con
  // datos de ejemplo (ver comentario en lifestyle-mock.ts).
  const assessment = latest ?? buildMockLifestyleAssessment(patientId)

  return (
    <Stack spacing={3}>
      <LifeEssential8Card assessment={assessment} />
      <ClinicalRiskScoresCard
        scores={clinicalScores.map((r) => ({
          destinationField: r.destinationField as string,
          score: r.score,
          interpretation: r.interpretation,
        }))}
      />
    </Stack>
  )
}
