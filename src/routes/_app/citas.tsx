import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/features/identity'
import { AppointmentsPage, appointmentsKeys, fetchAppointments } from '@/features/appointments'

export const Route = createFileRoute('/_app/citas')({
  beforeLoad: requirePermission('citas:read'),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: appointmentsKeys.lists(),
      queryFn: fetchAppointments,
    }),
  component: AppointmentsPage,
})
