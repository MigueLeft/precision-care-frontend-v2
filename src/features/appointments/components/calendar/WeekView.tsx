import { useEffect, useRef, useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { Appointment } from '../../types'
import { hourLabel, isSameDay, weekDays, WEEKDAY_SHORT } from '../../utils/calendar-dates'
import { HOUR_HEIGHT, WeekDayColumn } from './WeekDayColumn'

const GUTTER = 64
// Al abrir, la cuadrícula arranca a las 7 a.m. (como Google Calendar).
const FIRST_VISIBLE_HOUR = 7
const HOURS = Array.from({ length: 24 }, (_, h) => h)

type WeekViewProps = {
  anchor: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  onCreateAt?: (date: string, time: string) => void
}

// Vista semanal: días de lunes a domingo, horas a la izquierda y las citas
// como bloques dentro de cada día.
export function WeekView({ anchor, appointments, onOpen, onCreateAt }: WeekViewProps) {
  const days = weekDays(anchor)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [now, setNow] = useState(() => new Date())

  // Sincronización con el DOM y el reloj: posición inicial del scroll y
  // avance de la línea de la hora actual cada minuto.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: FIRST_VISIBLE_HOUR * HOUR_HEIGHT })
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const columns = `${GUTTER}px repeat(7, minmax(110px, 1fr))`

  return (
    <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: GUTTER + 7 * 110 }}>
          {/* Encabezado: día de la semana + número (hoy resaltado) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: columns, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box />
            {days.map((day, index) => {
              const today = isSameDay(day, now)
              return (
                <Box key={day.toISOString()} sx={{ textAlign: 'center', py: 1 }}>
                  <Typography
                    sx={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: today ? 'primary.main' : 'text.secondary' }}
                  >
                    {WEEKDAY_SHORT[index]}
                  </Typography>
                  <Box
                    sx={{
                      mx: 'auto',
                      mt: 0.25,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: today ? 'primary.main' : 'transparent',
                      color: today ? 'primary.contrastText' : 'text.primary',
                      fontSize: '22px',
                    }}
                  >
                    {day.getDate()}
                  </Box>
                </Box>
              )
            })}
          </Box>

          {/* Cuadrícula de horas */}
          <Box ref={scrollRef} sx={{ height: 'calc(100vh - 330px)', minHeight: 420, overflowY: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: columns }}>
              <Box>
                {HOURS.map((hour) => (
                  <Box key={hour} sx={{ height: HOUR_HEIGHT, position: 'relative' }}>
                    {hour > 0 && (
                      <Typography
                        sx={{ position: 'absolute', top: -8, right: 8, fontSize: '10px', color: 'text.secondary' }}
                      >
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
