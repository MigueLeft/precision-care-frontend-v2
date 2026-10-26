import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { ParaclinicalPanel } from '@/features/paraclinical'

export const Route = createFileRoute('/_app/pacientes_/$patientId/paraclinicos')({
  component: ParaclinicosRoute,
})

function ParaclinicosRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="resultados_paraclinico:read">
      <ParaclinicalPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
