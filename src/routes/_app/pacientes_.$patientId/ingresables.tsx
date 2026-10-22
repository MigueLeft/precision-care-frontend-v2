import { createFileRoute } from '@tanstack/react-router'
import { Divider, Stack } from '@mui/material'
import { IntakeResponsesPanel } from '@/features/intake-responses'
import { NutritionRecallsPanel } from '@/features/nutrition-recall'

export const Route = createFileRoute('/_app/pacientes_/$patientId/ingresables')({
  component: IngresablesRoute,
})

function IngresablesRoute() {
  const patientId = Number(Route.useParams().patientId)
  return (
    <Stack spacing={3}>
      <IntakeResponsesPanel patientId={patientId} />
      <Divider />
      <NutritionRecallsPanel patientId={patientId} />
    </Stack>
  )
}
