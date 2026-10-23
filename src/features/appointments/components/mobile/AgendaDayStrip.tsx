import { Box, ButtonBase, IconButton, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { AppButton } from '@/components/AppButton'
import {
  addDays,
  calendarTitle,
  isSameDay,
  toDateKey,
  weekDays,
  weekdayShort,
} from '../../utils/calendar-dates'

type AgendaDayStripProps = {
  selected: Date
  // Días (YYYY-MM-DD) con citas: se marcan con un punto.
  busyDays: Set<string>
  onSelect: (day: Date) => void
}

// Semana del día elegido como tira de botones (estilo calendario del
// teléfono), con flechas para cambiar de semana y "Hoy".
export function AgendaDayStrip({ selected, busyDays, onSelect }: AgendaDayStripProps) {
  const days = weekDays(selected)
  const today = new Date()

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', px: 1, pt: 1, pb: 1.25 }}>
      <Stack direction="row" sx={{ alignItems: 'center', px: 0.5, mb: 0.5 }}>
        <Typography sx={{ flex: 1, fontSize: '15px', fontWeight: 600, textTransform: 'capitalize' }}>
          {calendarTitle('month', selected)}
        </Typography>
        <AppButton size="small" variant="outlined" onClick={() => onSelect(today)} sx={{ borderRadius: '16px', minWidth: 0, px: 1.5 }}>
          Hoy
        </AppButton>
        <IconButton size="small" onClick={() => onSelect(addDays(selected, -7))} aria-label="Semana anterior">
          <ChevronLeftIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onSelect(addDays(selected, 7))} aria-label="Semana siguiente">
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {days.map((day) => {
          const active = isSameDay(day, selected)
          const isToday = isSameDay(day, today)
          return (
            <ButtonBase
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              sx={{
                flexDirection: 'column',
                py: 0.75,
                borderRadius: '12px',
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'primary.contrastText' : 'text.primary',
                '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' },
              }}
            >
              <Typography sx={{ fontSize: '11px', textTransform: 'uppercase', opacity: active ? 0.9 : 0.6, color: 'inherit' }}>
                {weekdayShort(day)}
              </Typography>
              <Typography sx={{ fontSize: '17px', fontWeight: isToday || active ? 700 : 500, color: isToday && !active ? 'primary.main' : 'inherit' }}>
                {day.getDate()}
              </Typography>
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  mt: 0.25,
                  bgcolor: busyDays.has(toDateKey(day)) ? (active ? 'primary.contrastText' : 'primary.main') : 'transparent',
                }}
              />
            </ButtonBase>
          )
        })}
      </Box>
    </Box>
  )
}
