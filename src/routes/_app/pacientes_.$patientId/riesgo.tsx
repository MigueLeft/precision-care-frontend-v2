import { createFileRoute } from '@tanstack/react-router'
import { RiskHistoryPanel } from '@/features/risk'

export const Route = createFileRoute('/_app/pacientes_/$patientId/riesgo')({
  component: RiesgoRoute,
})

function RiesgoRoute() {
  const { patientId } = Route.useParams()
  return <RiskHistoryPanel patientId={Number(patientId)} />
}
