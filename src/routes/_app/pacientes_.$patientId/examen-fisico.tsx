import { createFileRoute } from '@tanstack/react-router'
import { PhysicalExamPanel } from '@/features/physical-exam'

export const Route = createFileRoute('/_app/pacientes_/$patientId/examen-fisico')({
  component: ExamenFisicoRoute,
})

function ExamenFisicoRoute() {
  const { patientId } = Route.useParams()
  return <PhysicalExamPanel patientId={Number(patientId)} />
}
