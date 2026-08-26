import { createFileRoute } from '@tanstack/react-router'
import { QuestionnaireBuilderPage, questionnairesKeys, fetchQuestionnaireDetailed } from '@/features/questionnaires'

export const Route = createFileRoute('/_app/cuestionarios/$id')({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData({
      queryKey: questionnairesKeys.detail(Number(id)),
      queryFn: () => fetchQuestionnaireDetailed(Number(id)),
    }),
  component: CuestionarioBuilderRoute,
})

function CuestionarioBuilderRoute() {
  const { id } = Route.useParams()
  return <QuestionnaireBuilderPage questionnaireId={Number(id)} />
}
