import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { ConsultationsPanel } from '@/features/consultations'

export const Route = createFileRoute('/_app/pacientes_/$patientId/consultas')({
  component: ConsultasRoute,
})

function ConsultasRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="consultas:read">
      <ConsultationsPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
