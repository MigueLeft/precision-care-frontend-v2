import { Box, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationsByPatient } from '../../hooks/useConsultationsByPatient'
import { EvolutionChanges } from './EvolutionChanges'

type EvolutionPanelProps = {
  patientId: number
}

// Expediente › Nota evolutiva: por cada consulta (desde la segunda), qué cambió
// respecto a la anterior. Más reciente primero.
export function EvolutionPanel({ patientId }: EvolutionPanelProps) {
  const { data: consultations = [], isLoading, isError, error } =
    useConsultationsByPatient(patientId)

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  // La lista viene ordenada de más reciente a más antigua; la primera consulta
  // no tiene con qué compararse.
  const comparable = consultations.slice(0, -1)
  if (comparable.length === 0) {
    return <EmptyState message="Se necesitan al menos dos consultas para mostrar la evolución." />
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {comparable.map((consultation) => (
        <SectionCard
          key={consultation.id}
          title={
            <Box>
              <Typography variant="h3">{formatShortDate(consultation.startAt)}</Typography>
              {consultation.specialistName && (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {consultation.specialistName}
                </Typography>
              )}
            </Box>
          }
        >
          <EvolutionChanges consultationId={consultation.id} />
        </SectionCard>
      ))}
    </Box>
  )
}
