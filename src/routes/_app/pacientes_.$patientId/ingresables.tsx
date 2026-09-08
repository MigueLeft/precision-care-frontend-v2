import { createFileRoute } from '@tanstack/react-router'
import { QuestionnaireResponsesPanel } from '@/features/questionnaire-responses'

export const Route = createFileRoute('/_app/pacientes_/$patientId/ingresables')({
  component: IngresablesRoute,
})

function IngresablesRoute() {
  const { patientId } = Route.useParams()
  return <QuestionnaireResponsesPanel patientId={Number(patientId)} />
}
