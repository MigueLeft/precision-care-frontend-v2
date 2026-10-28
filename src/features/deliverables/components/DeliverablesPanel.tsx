import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useMe } from '@/features/identity'
import { useDeliverablesByPatient } from '../hooks/useDeliverablesByPatient'
import { DeliverableCard } from './DeliverableCard'
import { StudyOrderDialog } from './study-orders/StudyOrderDialog'

interface DeliverablesPanelProps {
  patientId: number
}

// Registro de lo entregado al paciente. Las órdenes de laboratorio y recetas se
// generan desde la consulta; las órdenes de estudio también se crean aquí.
export function DeliverablesPanel({ patientId }: DeliverablesPanelProps) {
  const { data: deliverables = [], isLoading, isError, error } = useDeliverablesByPatient(patientId)
  const { data: me } = useMe()
  const canCreate = !!me?.permissions.includes('entregables:create')
  // 'new' = orden nueva; número = id de la orden a editar.
  const [studyOrder, setStudyOrder] = useState<'new' | number | null>(null)

  return (
    <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary', flex: 1 }}>
            Las órdenes de laboratorio y recetas se generan desde la consulta. Aquí queda el registro
            de lo que se le entregó al paciente.
          </Typography>
          {canCreate && (
            <AppButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 18 }} />} onClick={() => setStudyOrder('new')}>
              Orden de estudio
            </AppButton>
          )}
        </Stack>
        {deliverables.length === 0 && <EmptyState message="Sin entregables generados." />}
        {deliverables.map((deliverable) => (
          <DeliverableCard
            key={deliverable.id}
            deliverable={deliverable}
            onEditStudyOrder={canCreate ? setStudyOrder : undefined}
          />
        ))}
      </Stack>
      <StudyOrderDialog
        open={studyOrder !== null}
        orderId={typeof studyOrder === 'number' ? studyOrder : null}
        patientId={patientId}
        onClose={() => setStudyOrder(null)}
      />
    </QueryBoundary>
  )
}
