import { createFileRoute } from '@tanstack/react-router'
import { EvolutionPanel } from '@/features/consultations'

export const Route = createFileRoute('/_app/pacientes_/$patientId/nota-evolutiva')({
  component: NotaEvolutivaRoute,
})

function NotaEvolutivaRoute() {
  const { patientId } = Route.useParams()
  return <EvolutionPanel patientId={Number(patientId)} />
}
