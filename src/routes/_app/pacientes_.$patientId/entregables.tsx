import { createFileRoute } from '@tanstack/react-router'
import { DeliverablesPanel } from '@/features/deliverables'

export const Route = createFileRoute('/_app/pacientes_/$patientId/entregables')({
  component: EntregablesRoute,
})

function EntregablesRoute() {
  const { patientId } = Route.useParams()
  return <DeliverablesPanel patientId={Number(patientId)} />
}
