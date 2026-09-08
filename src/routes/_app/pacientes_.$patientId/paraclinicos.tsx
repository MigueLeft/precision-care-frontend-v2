import { createFileRoute } from '@tanstack/react-router'
import { ParaclinicalPanel } from '@/features/paraclinical'

export const Route = createFileRoute('/_app/pacientes_/$patientId/paraclinicos')({
  component: ParaclinicosRoute,
})

function ParaclinicosRoute() {
  const { patientId } = Route.useParams()
  return <ParaclinicalPanel patientId={Number(patientId)} />
}
