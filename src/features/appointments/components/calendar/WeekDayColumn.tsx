import { useState, type MouseEvent } from 'react'
import { Box } from '@mui/material'
import type { Appointment } from '../../types'
import { layoutDay } from '../../utils/calendar-layout'
import { isCreatableDay, isSameDay, toDateKey } from '../../utils/calendar-dates'
import { CalendarEventCard } from './CalendarEventCard'
import { SlotHoverGhost } from './SlotHoverGhost'

export const HOUR_HEIGHT = 48
const SLOT_HEIGHT = HOUR_HEIGHT / 2
const DAY_HEIGHT = HOUR_HEIGHT * 24

type WeekDayColumnProps = {
  day: Date
  now: Date
  appointments: Appointment[]
  onOpen: (id: number) => void
  // Clic en un hueco: crear cita ese día a esa hora (bloques de 30 min).
  onCreateAt?: (date: string, time: string) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

// Media hora (0–47) bajo el puntero.
function slotAt(event: MouseEvent<HTMLDivElement>) {
  const offset = event.clientY - event.currentTarget.getBoundingClientRect().top
  return Math.min(47, Math.max(0, Math.floor(offset / SLOT_HEIGHT)))
}

export function WeekDayColumn({ day, now, appointments, onOpen, onCreateAt }: WeekDayColumnProps) {
  const [hoverSlot, setHoverSlot] = useState<number | null>(null)
  const positioned = layoutDay(appointments, day)
  const isToday = isSameDay(day, now)
  const canCreate = !!onCreateAt && isCreatableDay(day)
  const nowTop = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * DAY_HEIGHT

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!canCreate) return
    const slot = slotAt(event)
    onCreateAt?.(toDateKey(day), `${pad(Math.floor(slot / 2))}:${slot % 2 ? '30' : '00'}`)
  }

  return (
    <Box
      onClick={handleClick}
      onMouseMove={(event) => canCreate && setHoverSlot(slotAt(event))}
      onMouseLeave={() => setHoverSlot(null)}
      sx={{
        position: 'relative',
        height: DAY_HEIGHT,
        borderLeft: '1px solid',
        borderColor: 'divider',
        cursor: canCreate ? 'pointer' : 'default',
        // Línea por cada hora, como la cuadrícula de Google Calendar.
        backgroundImage: (theme) =>
          `repeating-linear-gradient(to bottom, ${theme.palette.divider} 0 1px, transparent 1px ${HOUR_HEIGHT}px)`,
        bgcolor: isCreatableDay(day) ? 'transparent' : 'action.hover',
      }}
    >
      {hoverSlot !== null && <SlotHoverGhost day={day} slot={hoverSlot} slotHeight={SLOT_HEIGHT} />}

      {positioned.map((item) => (
        <Box
          key={item.appointment.id}
          // Sobre una cita no se muestra el "+ nueva cita".
          onMouseMove={(event) => event.stopPropagation()}
          onMouseEnter={() => setHoverSlot(null)}
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
