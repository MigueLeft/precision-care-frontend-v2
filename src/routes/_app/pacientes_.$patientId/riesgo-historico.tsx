import { createFileRoute } from '@tanstack/react-router'
import { RiskTimelinePanel } from '@/features/risk'

export const Route = createFileRoute('/_app/pacientes_/$patientId/riesgo-historico')({
  component: RiesgoHistoricoRoute,
})

function RiesgoHistoricoRoute() {
  const { patientId } = Route.useParams()
  return <RiskTimelinePanel patientId={Number(patientId)} />
}
