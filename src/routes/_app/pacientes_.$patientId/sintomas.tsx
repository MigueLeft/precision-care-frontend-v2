import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { PatientSymptomsPanel } from '@/features/consultations'

export const Route = createFileRoute('/_app/pacientes_/$patientId/sintomas')({
  component: SintomasRoute,
})

function SintomasRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="consultas:read">
      <PatientSymptomsPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
