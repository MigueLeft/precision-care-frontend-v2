import type { MouseEvent } from 'react'
import { Box } from '@mui/material'
import type { Appointment } from '../../types'
import { layoutDay } from '../../utils/calendar-layout'
import { isSameDay, toDateKey } from '../../utils/calendar-dates'
import { CalendarEventCard } from './CalendarEventCard'

export const HOUR_HEIGHT = 48
const DAY_HEIGHT = HOUR_HEIGHT * 24

type WeekDayColumnProps = {
  day: Date
  now: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  // Clic en un hueco: crear cita ese día a esa hora (redondeada a 30 min).
  onCreateAt?: (date: string, time: string) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export function WeekDayColumn({ day, now, appointments, onOpen, onCreateAt }: WeekDayColumnProps) {
  const positioned = layoutDay(appointments, day)
  const isToday = isSameDay(day, now)
  const nowTop = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * DAY_HEIGHT

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!onCreateAt) return
    const offset = event.clientY - event.currentTarget.getBoundingClientRect().top
    const halfHours = Math.min(47, Math.max(0, Math.floor(offset / (HOUR_HEIGHT / 2))))
    onCreateAt(toDateKey(day), `${pad(Math.floor(halfHours / 2))}:${halfHours % 2 ? '30' : '00'}`)
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        height: DAY_HEIGHT,
        borderLeft: '1px solid',
        borderColor: 'divider',
        cursor: onCreateAt ? 'pointer' : 'default',
        // Línea por cada hora, como la cuadrícula de Google Calendar.
        backgroundImage: (theme) =>
          `repeating-linear-gradient(to bottom, ${theme.palette.divider} 0 1px, transparent 1px ${HOUR_HEIGHT}px)`,
        '&:hover': onCreateAt ? { bgcolor: 'action.hover' } : undefined,
      }}
    >
      {positioned.map((item) => (
        <Box
          key={item.appointment.id}
          sx={{
            position: 'absolute',
            top: `${item.top}%`,
            height: `${item.height}%`,
            left: `calc(${item.left}% + 2px)`,
            width: `calc(${item.width}% - 4px)`,
            zIndex: 1,
            p: '1px',
          }}
        >
          <CalendarEventCard appointment={item.appointment} onClick={onOpen} />
        </Box>
      ))}

      {isToday && (
        <Box sx={{ position: 'absolute', top: nowTop, left: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}>
          <Box sx={{ position: 'absolute', left: -6, top: -5, width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
          <Box sx={{ height: 2, bgcolor: 'error.main' }} />
        </Box>
      )}
    </Box>
  )
}
