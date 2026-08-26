import { createFileRoute } from '@tanstack/react-router'
import { QuestionnairesPage, questionnairesKeys, fetchQuestionnaires } from '@/features/questionnaires'

export const Route = createFileRoute('/_app/cuestionarios')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({ queryKey: questionnairesKeys.lists(), queryFn: fetchQuestionnaires }),
  component: QuestionnairesPage,
})
