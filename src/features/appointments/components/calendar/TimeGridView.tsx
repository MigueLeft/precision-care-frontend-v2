import { useEffect, useRef, useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { Appointment } from '../../types'
import { hourLabel } from '../../utils/calendar-dates'
import { HOUR_HEIGHT, WeekDayColumn } from './WeekDayColumn'
import { TimeGridDayHeader } from './TimeGridDayHeader'

const GUTTER = 64
// Al abrir, la cuadrícula arranca a las 7 a.m. (como Google Calendar).
const FIRST_VISIBLE_HOUR = 7
const HOURS = Array.from({ length: 24 }, (_, h) => h)

type TimeGridViewProps = {
  // Un día (vista Día) o siete (vista Semana).
  days: Date[]
  appointments: Appointment[]
  onOpen: (id: number) => void
  // Clic en el número del día: abre la vista de ese día.
  onShowDay?: (day: Date) => void
  onCreateAt?: (date: string, time: string) => void
}

// Cuadrícula por horas: horas a la izquierda y las citas como bloques dentro
// de cada día.
export function TimeGridView({ days, appointments, onOpen, onShowDay, onCreateAt }: TimeGridViewProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [now, setNow] = useState(() => new Date())
  const minColumn = days.length === 1 ? 240 : 110

  // Sincronización con el DOM y el reloj: posición inicial del scroll y
  // avance de la línea de la hora actual cada minuto.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: FIRST_VISIBLE_HOUR * HOUR_HEIGHT })
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const columns = `${GUTTER}px repeat(${days.length}, minmax(${minColumn}px, 1fr))`

  return (
    <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: GUTTER + days.length * minColumn }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: columns, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box />
            {days.map((day) => (
              <TimeGridDayHeader key={day.toISOString()} day={day} now={now} onClick={onShowDay} />
            ))}
          </Box>

          <Box ref={scrollRef} sx={{ height: 'calc(100vh - 330px)', minHeight: 420, overflowY: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: columns }}>
              <Box>
                {HOURS.map((hour) => (
                  <Box key={hour} sx={{ height: HOUR_HEIGHT, position: 'relative' }}>
                    {hour > 0 && (
                      <Typography sx={{ position: 'absolute', top: -8, right: 8, fontSize: '10px', color: 'text.secondary' }}>
                        {hourLabel(hour)}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              {days.map((day) => (
                <WeekDayColumn
                  key={day.toISOString()}
                  day={day}
                  now={now}
                  appointments={appointments}
                  onOpen={onOpen}
                  onCreateAt={onCreateAt}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
