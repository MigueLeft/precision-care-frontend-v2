import { Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useDeliverablesByPatient } from '../hooks/useDeliverablesByPatient'
import { DeliverableCard } from './DeliverableCard'

interface DeliverablesPanelProps {
  patientId: number
}

// Registro de lo entregado al paciente (órdenes de laboratorio y recetas). Se
// generan desde la consulta: al imprimir o al finalizarla.
export function DeliverablesPanel({ patientId }: DeliverablesPanelProps) {
  const { data: deliverables = [], isLoading, isError, error } =
    useDeliverablesByPatient(patientId)

  return (
    <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <Stack spacing={2}>
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          Las órdenes de laboratorio y recetas se generan desde la consulta. Aquí queda el registro
          de lo que se le entregó al paciente.
        </Typography>
        {deliverables.length === 0 && <EmptyState message="Sin entregables generados." />}
        {deliverables.map((deliverable) => (
          <DeliverableCard key={deliverable.id} deliverable={deliverable} />
        ))}
      </Stack>
    </QueryBoundary>
  )
}
