import { Box, Stack, Typography } from '@mui/material'
import type { Appointment } from '../../types'
import { weekDays } from '../../utils/calendar-dates'
import { TimeGridView } from '../calendar/TimeGridView'
import { AgendaAppointmentCard } from './AgendaAppointmentCard'

export type AgendaView = 'day' | 'week' | 'month'

type AgendaViewBodyProps = {
  view: AgendaView
  selected: Date
  dayAppointments: Appointment[]
  periodAppointments: Appointment[]
  showDoctor: boolean
  onOpen: (id: number) => void
  onShowDay: (day: Date) => void
  onCreateAt?: (date: string, time: string) => void
}

// Día: lista de tarjetas. Semana: cuadrícula por horas. (El mes se navega
// con la cuadrícula compacta de arriba y aquí se ven las citas del día tocado.)
export function AgendaViewBody({
  view,
  selected,
  dayAppointments,
  periodAppointments,
  showDoctor,
  onOpen,
  onShowDay,
  onCreateAt,
}: AgendaViewBodyProps) {
  if (view === 'week') {
    return (
      <Box sx={{ px: 1, pt: 1.5 }}>
        <TimeGridView
          days={weekDays(selected)}
          appointments={periodAppointments}
          onOpen={onOpen}
          onShowDay={onShowDay}
          onCreateAt={onCreateAt}
        />
      </Box>
    )
  }

  return (
    <Stack spacing={1.25} sx={{ px: 2, pt: 1.5 }}>
      {dayAppointments.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '14px', py: 6 }}>
          No hay citas para este día.
        </Typography>
      ) : (
        dayAppointments.map((appointment) => (
          <AgendaAppointmentCard
            key={appointment.id}
            appointment={appointment}
            showDoctor={showDoctor}
            onOpen={(item) => onOpen(item.id)}
          />
        ))
      )}
    </Stack>
  )
}
