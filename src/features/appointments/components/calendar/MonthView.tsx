import { Box, Paper, Typography } from '@mui/material'
import type { Appointment } from '../../types'
import { appointmentsOfDay } from '../../utils/calendar-layout'
import { isSameDay, monthGridDays, WEEKDAY_SHORT } from '../../utils/calendar-dates'
import { MonthDayCell } from './MonthDayCell'

type MonthViewProps = {
  anchor: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  // Número del día o "+N más": abre la vista de ese día.
  onShowDay: (day: Date) => void
  onCreateAt?: (date: string, time: string) => void
}

// Vista mensual estilo Google Calendar: 6 semanas, cada día con sus citas
// como chips de una línea.
export function MonthView({ anchor, appointments, onOpen, onShowDay, onCreateAt }: MonthViewProps) {
  const days = monthGridDays(anchor)
  const today = new Date()

  return (
    <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {WEEKDAY_SHORT.map((label) => (
          <Typography
            key={label}
            sx={{ textAlign: 'center', py: 1, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}
          >
            {label}
          </Typography>
        ))}

        {days.map((day) => (
          <MonthDayCell
            key={day.toISOString()}
            day={day}
            inMonth={day.getMonth() === anchor.getMonth()}
            isToday={isSameDay(day, today)}
            appointments={appointmentsOfDay(appointments, day)}
            onOpen={onOpen}
            onShowDay={onShowDay}
            onCreateAt={onCreateAt}
          />
        ))}
      </Box>
    </Paper>
  )
}
