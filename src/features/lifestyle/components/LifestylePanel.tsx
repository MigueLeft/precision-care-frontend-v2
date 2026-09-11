import { Stack } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useLifestyleByPatient } from '../hooks/useLifestyleByPatient'
import { LifeEssential8Card, LifeEssential8Empty } from './LifeEssential8Card'

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

  if (!latest) {
    return <LifeEssential8Empty />
  }

  return (
    <Stack spacing={3}>
      <LifeEssential8Card assessment={latest} />
    </Stack>
  )
}
