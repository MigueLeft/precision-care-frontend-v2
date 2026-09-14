import { createFileRoute } from '@tanstack/react-router'
import { IntakeResponsesPanel } from '@/features/intake-responses'

export const Route = createFileRoute('/_app/pacientes_/$patientId/ingresables')({
  component: IngresablesRoute,
})

function IngresablesRoute() {
  const { patientId } = Route.useParams()
  return <IntakeResponsesPanel patientId={Number(patientId)} />
}
