import { createFileRoute } from '@tanstack/react-router'
import { AnthropometryPanel } from '@/features/anthropometry'

export const Route = createFileRoute('/_app/pacientes_/$patientId/antropometria')({
  component: AntropometriaRoute,
})

function AntropometriaRoute() {
  const { patientId } = Route.useParams()
  return <AnthropometryPanel patientId={Number(patientId)} />
}
