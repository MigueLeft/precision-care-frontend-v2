import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { PatientDiseasesPanel } from '@/features/patient-diseases'

export const Route = createFileRoute('/_app/pacientes_/$patientId/enfermedades')({
  component: EnfermedadesRoute,
})

function EnfermedadesRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="consultas:read">
      <PatientDiseasesPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
