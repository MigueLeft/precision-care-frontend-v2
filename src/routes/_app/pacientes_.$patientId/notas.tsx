import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { ClinicalNotesPanel } from '@/features/medical-record'

export const Route = createFileRoute('/_app/pacientes_/$patientId/notas')({
  component: NotasRoute,
})

function NotasRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="consultas:read">
      <ClinicalNotesPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
