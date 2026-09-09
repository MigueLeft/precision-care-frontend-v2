import { createFileRoute } from '@tanstack/react-router'
import { PatientDiseasesPanel } from '@/features/patient-diseases'

export const Route = createFileRoute('/_app/pacientes_/$patientId/enfermedades')({
  component: EnfermedadesRoute,
})

function EnfermedadesRoute() {
  const { patientId } = Route.useParams()
  return <PatientDiseasesPanel patientId={Number(patientId)} />
}
