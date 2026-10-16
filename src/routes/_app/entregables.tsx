import { createFileRoute } from '@tanstack/react-router'
import { DeliverablesSettingsPage, deliverablesKeys, fetchDeliverableTemplates } from '@/features/deliverables'

export const Route = createFileRoute('/_app/entregables')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: deliverablesKeys.templates,
      queryFn: fetchDeliverableTemplates,
    }),
  component: DeliverablesSettingsPage,
})
