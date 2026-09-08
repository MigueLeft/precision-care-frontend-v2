import { createFileRoute } from '@tanstack/react-router'
import { ConsultationsPanel } from '@/features/consultations'

export const Route = createFileRoute('/_app/pacientes_/$patientId/consultas')({
  component: ConsultasRoute,
})

function ConsultasRoute() {
  const { patientId } = Route.useParams()
  return <ConsultationsPanel patientId={Number(patientId)} />
}
