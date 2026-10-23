import { createFileRoute } from '@tanstack/react-router'
import { MobileAgendaPage, appointmentsKeys, fetchAppointments } from '@/features/appointments'

export const Route = createFileRoute('/_mobile/agenda')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: appointmentsKeys.lists(),
      queryFn: fetchAppointments,
    }),
  component: MobileAgendaPage,
})
