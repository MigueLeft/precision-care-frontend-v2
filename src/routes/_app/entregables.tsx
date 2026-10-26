import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/features/identity'
import { DeliverablesSettingsPage, deliverablesKeys, fetchDeliverableTemplates } from '@/features/deliverables'

export const Route = createFileRoute('/_app/entregables')({
  beforeLoad: requirePermission('plantillas_entregable:read'),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: deliverablesKeys.templates,
      queryFn: fetchDeliverableTemplates,
    }),
  component: DeliverablesSettingsPage,
})
