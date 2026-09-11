import { Stack } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useLifestyleByPatient } from '../hooks/useLifestyleByPatient'
import { buildMockLifestyleAssessment } from '../utils/lifestyle-mock'
import { LifeEssential8Card } from './LifeEssential8Card'

interface LifestylePanelProps {
  patientId: number
}

export function LifestylePanel({ patientId }: LifestylePanelProps) {
  const { data: evaluations = [], isLoading, isError, error } =
    useLifestyleByPatient(patientId)
  const latest = evaluations[0]

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
    </Stack>
  )
}
