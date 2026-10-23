import type { Appointment } from '../types'
import type { CalendarView } from '../utils/calendar-dates'
import { AppointmentsTable } from './AppointmentsTable'
import { MonthView } from './calendar/MonthView'
import { WeekView } from './calendar/WeekView'

type AppointmentsViewBodyProps = {
  view: CalendarView
  anchor: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  onShowWeekOf: (day: Date) => void
  onCreateAt?: (date: string, time: string) => void
}

// Contenido según la vista elegida: lista, semana o mes.
export function AppointmentsViewBody({ view, anchor, appointments, onOpen, onShowWeekOf, onCreateAt }: AppointmentsViewBodyProps) {
  if (view === 'week') {
    return <WeekView anchor={anchor} appointments={appointments} onOpen={onOpen} onCreateAt={onCreateAt} />
  }
  if (view === 'month') {
    return (
      <MonthView
        anchor={anchor}
        appointments={appointments}
        onOpen={onOpen}
        onShowDay={onShowWeekOf}
        onCreateAt={onCreateAt}
      />
    )
  }
  return <AppointmentsTable appointments={appointments} onView={onOpen} />
}
