import { createFileRoute } from '@tanstack/react-router'
import { ConsultationPreloadPage } from '@/features/appointments'

export const Route = createFileRoute('/_app/citas_/$appointmentId_/precarga')({
  component: ConsultationPreloadRoute,
})

function ConsultationPreloadRoute() {
  const { appointmentId } = Route.useParams()
  return <ConsultationPreloadPage appointmentId={Number(appointmentId)} />
}
