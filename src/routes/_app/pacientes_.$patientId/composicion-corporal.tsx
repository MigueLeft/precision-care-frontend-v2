import { createFileRoute } from '@tanstack/react-router'
import { BodyCompositionPanel } from '@/features/body-composition'

export const Route = createFileRoute(
  '/_app/pacientes_/$patientId/composicion-corporal',
)({
  component: ComposicionCorporalRoute,
})

function ComposicionCorporalRoute() {
  const { patientId } = Route.useParams()
  return <BodyCompositionPanel patientId={Number(patientId)} />
}
