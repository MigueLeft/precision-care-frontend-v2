import { createFileRoute } from '@tanstack/react-router'
import { PermissionGate } from '@/features/identity'
import { AntecedentsPanel } from '@/features/antecedents'

export const Route = createFileRoute('/_app/pacientes_/$patientId/antecedentes')({
  component: AntecedentesRoute,
})

function AntecedentesRoute() {
  const { patientId } = Route.useParams()
  return (
    <PermissionGate permission="antecedentes:read">
      <AntecedentsPanel patientId={Number(patientId)} />
    </PermissionGate>
  )
}
