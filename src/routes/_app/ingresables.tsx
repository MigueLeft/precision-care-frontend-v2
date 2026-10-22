import { createFileRoute } from '@tanstack/react-router'
import { IntakesPage, intakeKeys, fetchIntakes } from '@/features/intake'
import { NutritionRecallCard } from '@/features/nutrition-recall'

export const Route = createFileRoute('/_app/ingresables')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({ queryKey: intakeKeys.lists(), queryFn: fetchIntakes }),
  component: IngresablesRoute,
})

function IngresablesRoute() {
  return (
    <IntakesPage>
      <NutritionRecallCard />
    </IntakesPage>
  )
}
