import { createFileRoute } from '@tanstack/react-router'
import { MobileAgendaPage, appointmentsKeys, fetchAppointments } from '@/features/appointments'
import { PushNotificationsBanner } from '@/features/notifications'

export const Route = createFileRoute('/_mobile/agenda')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: appointmentsKeys.lists(),
      queryFn: fetchAppointments,
    }),
  component: AgendaRoute,
})

// La agenda y, arriba, el aviso para activar las notificaciones.
function AgendaRoute() {
  return (
    <>
      <PushNotificationsBanner />
      <MobileAgendaPage />
    </>
  )
}
