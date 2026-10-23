import { Box, ButtonBase, IconButton, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  calendarTitle,
  isSameDay,
  monthGridDays,
  shiftAnchor,
  toDateKey,
  WEEKDAY_SHORT,
} from '../../utils/calendar-dates'

type AgendaMonthGridProps = {
  selected: Date
  // Citas por día (YYYY-MM-DD → cantidad).
  countByDay: Map<string, number>
  onSelect: (day: Date) => void
  // Tocar un día abre la vista de ese día.
  onOpenDay: (day: Date) => void
}

// Mes compacto para el teléfono: número del día y cuántas citas tiene.
export function AgendaMonthGrid({ selected, countByDay, onSelect, onOpenDay }: AgendaMonthGridProps) {
  const days = monthGridDays(selected)
  const today = new Date()

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', px: 1, pb: 1 }}>
      <Stack direction="row" sx={{ alignItems: 'center', px: 0.5, py: 1 }}>
        <IconButton size="small" onClick={() => onSelect(shiftAnchor('month', selected, -1))} aria-label="Mes anterior">
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ flex: 1, textAlign: 'center', fontSize: '15px', fontWeight: 600, textTransform: 'capitalize' }}>
          {calendarTitle('month', selected)}
        </Typography>
        <IconButton size="small" onClick={() => onSelect(shiftAnchor('month', selected, 1))} aria-label="Mes siguiente">
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 0.5 }}>
        {WEEKDAY_SHORT.map((label) => (
          <Typography key={label} sx={{ textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', pb: 0.5 }}>
            {label}
          </Typography>
        ))}
        {days.map((day) => {
          const count = countByDay.get(toDateKey(day)) ?? 0
          const inMonth = day.getMonth() === selected.getMonth()
          const isToday = isSameDay(day, today)
          return (
            <ButtonBase
              key={day.toISOString()}
              onClick={() => onOpenDay(day)}
              sx={{ flexDirection: 'column', py: 0.75, borderRadius: '10px', minHeight: 54, '&:active': { bgcolor: 'action.selected' } }}
            >
              <Typography
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: isToday ? 700 : 500,
                  bgcolor: isToday ? 'primary.main' : 'transparent',
                  color: isToday ? 'primary.contrastText' : inMonth ? 'text.primary' : 'text.disabled',
                }}
              >
                {day.getDate()}
              </Typography>
              <Typography sx={{ fontSize: '10.5px', fontWeight: 700, color: 'primary.main', minHeight: 14 }}>
                {count > 0 ? `${count} ${count === 1 ? 'cita' : 'citas'}` : ''}
              </Typography>
            </ButtonBase>
          )
        })}
      </Box>
    </Box>
  )
}
