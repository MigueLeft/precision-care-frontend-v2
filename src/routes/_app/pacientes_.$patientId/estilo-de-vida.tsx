import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { LifestylePanel } from '@/features/lifestyle'

export const Route = createFileRoute('/_app/pacientes_/$patientId/estilo-de-vida')({
  component: EstiloDeVidaRoute,
})

function EstiloDeVidaRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="estilo_vida:read">
      <LifestylePanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
