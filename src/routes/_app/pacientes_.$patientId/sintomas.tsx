import { createFileRoute } from '@tanstack/react-router'
import { PatientSymptomsPanel } from '@/features/consultations'

export const Route = createFileRoute('/_app/pacientes_/$patientId/sintomas')({
  component: SintomasRoute,
})

function SintomasRoute() {
  const { patientId } = Route.useParams()
  return <PatientSymptomsPanel patientId={Number(patientId)} />
}
