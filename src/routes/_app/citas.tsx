import { createFileRoute } from '@tanstack/react-router'
import { AppointmentsPage, appointmentsKeys, fetchAppointments } from '@/features/appointments'

export const Route = createFileRoute('/_app/citas')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: appointmentsKeys.lists(),
      queryFn: fetchAppointments,
    }),
  component: AppointmentsPage,
})
