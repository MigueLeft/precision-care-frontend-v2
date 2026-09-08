import { createFileRoute } from '@tanstack/react-router'
import { AntecedentsPanel } from '@/features/antecedents'

export const Route = createFileRoute('/_app/pacientes_/$patientId/antecedentes')({
  component: AntecedentesRoute,
})

function AntecedentesRoute() {
  const { patientId } = Route.useParams()
  return <AntecedentsPanel patientId={Number(patientId)} />
}
