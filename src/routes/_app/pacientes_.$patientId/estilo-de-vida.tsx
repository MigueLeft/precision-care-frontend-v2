import { createFileRoute } from '@tanstack/react-router'
import { LifestylePanel } from '@/features/lifestyle'

export const Route = createFileRoute('/_app/pacientes_/$patientId/estilo-de-vida')({
  component: EstiloDeVidaRoute,
})

function EstiloDeVidaRoute() {
  const { patientId } = Route.useParams()
  return <LifestylePanel patientId={Number(patientId)} />
}
