import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material'
import type { Appointment } from '../../types'
import { appointmentsOfDay } from '../../utils/calendar-layout'
import { isSameDay, monthGridDays, toDateKey, WEEKDAY_SHORT } from '../../utils/calendar-dates'
import { CalendarEventCard } from './CalendarEventCard'

// Citas visibles por día antes del "+N más".
const MAX_PER_DAY = 3

type MonthViewProps = {
  anchor: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  // "+N más": abre la semana de ese día.
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

        {days.map((day) => {
          const dayAppointments = appointmentsOfDay(appointments, day)
          const visible = dayAppointments.slice(0, MAX_PER_DAY)
          const hidden = dayAppointments.length - visible.length
          const inMonth = day.getMonth() === anchor.getMonth()
          const isToday = isSameDay(day, today)

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onCreateAt?.(toDateKey(day), '09:00')}
              sx={{
                minHeight: 118,
                p: 0.5,
                borderRight: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: inMonth ? 'background.paper' : 'action.hover',
                cursor: onCreateAt ? 'pointer' : 'default',
                minWidth: 0,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                <Typography
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: isToday ? 700 : 500,
                    bgcolor: isToday ? 'primary.main' : 'transparent',
                    color: isToday ? 'primary.contrastText' : inMonth ? 'text.primary' : 'text.disabled',
                  }}
                >
                  {day.getDate()}
                </Typography>
              </Box>
              <Stack spacing={0.375}>
                {visible.map((appointment) => (
                  <CalendarEventCard key={appointment.id} appointment={appointment} compact onClick={onOpen} />
                ))}
                {hidden > 0 && (
                  <ButtonBase
                    onClick={(event) => {
                      event.stopPropagation()
                      onShowDay(day)
                    }}
                    sx={{ justifyContent: 'flex-start', px: 0.75, borderRadius: '4px', fontSize: '12px', fontWeight: 600, color: 'text.secondary', '&:hover': { bgcolor: 'action.selected' } }}
                  >
                    +{hidden} más
                  </ButtonBase>
                )}
              </Stack>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}
