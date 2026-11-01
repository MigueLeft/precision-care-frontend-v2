import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { DeliverablesPanel } from '@/features/deliverables'

export const Route = createFileRoute('/_app/pacientes_/$patientId/entregables')({
  component: EntregablesRoute,
})

function EntregablesRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="entregables:read">
      <DeliverablesPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
