import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { MedicationsPanel } from '@/features/patient-medications'

export const Route = createFileRoute('/_app/pacientes_/$patientId/medicamentos')({
  component: MedicamentosRoute,
})

function MedicamentosRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="medicamentos:read">
      <MedicationsPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
