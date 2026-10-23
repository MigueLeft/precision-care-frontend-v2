import type { Appointment } from '../types'
import { weekDays, type CalendarView } from '../utils/calendar-dates'
import { AppointmentsTable } from './AppointmentsTable'
import { MonthView } from './calendar/MonthView'
import { TimeGridView } from './calendar/TimeGridView'

type AppointmentsViewBodyProps = {
  view: CalendarView
  anchor: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  onShowDay: (day: Date) => void
  onCreateAt?: (date: string, time: string) => void
}

// Contenido según la vista elegida: lista, día, semana o mes.
export function AppointmentsViewBody({ view, anchor, appointments, onOpen, onShowDay, onCreateAt }: AppointmentsViewBodyProps) {
  if (view === 'day' || view === 'week') {
    return (
      <TimeGridView
        // key: al cambiar de vista vuelve a posicionarse en las 7 a.m.
        key={view}
        days={view === 'day' ? [anchor] : weekDays(anchor)}
        appointments={appointments}
        onOpen={onOpen}
        onShowDay={view === 'week' ? onShowDay : undefined}
        onCreateAt={onCreateAt}
      />
    )
  }
  if (view === 'month') {
    return (
      <MonthView
        anchor={anchor}
        appointments={appointments}
        onOpen={onOpen}
        onShowDay={onShowDay}
        onCreateAt={onCreateAt}
      />
    )
  }
  return <AppointmentsTable appointments={appointments} onView={onOpen} />
}
