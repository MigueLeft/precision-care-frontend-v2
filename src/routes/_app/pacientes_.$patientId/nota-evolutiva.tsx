import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { EvolutionPanel } from '@/features/consultations'

export const Route = createFileRoute('/_app/pacientes_/$patientId/nota-evolutiva')({
  component: NotaEvolutivaRoute,
})

function NotaEvolutivaRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="consultas:read">
      <EvolutionPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
