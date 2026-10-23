import { IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ViewListIcon from '@mui/icons-material/ViewList'
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { AppButton } from '@/components/AppButton'
import { calendarTitle, type CalendarView } from '../../utils/calendar-dates'

type CalendarHeaderProps = {
  view: CalendarView
  anchor: Date
  count: number
  onViewChange: (view: CalendarView) => void
  onToday: () => void
  onNavigate: (direction: 1 | -1) => void
}

// Barra estilo Google Calendar: Hoy, anterior/siguiente, título del periodo
// y selector de vista.
export function CalendarHeader({ view, anchor, count, onViewChange, onToday, onNavigate }: CalendarHeaderProps) {
  const isCalendar = view !== 'list'
  const unit = view === 'month' ? 'Mes' : 'Semana'

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}
    >
      {isCalendar ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <AppButton variant="outlined" size="small" onClick={onToday} sx={{ borderRadius: '18px', px: 2 }}>
            Hoy
          </AppButton>
          <Tooltip title={`${unit} anterior`}>
            <IconButton size="small" onClick={() => onNavigate(-1)} aria-label={`${unit} anterior`}>
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`${unit} siguiente`}>
            <IconButton size="small" onClick={() => onNavigate(1)} aria-label={`${unit} siguiente`}>
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
          <Typography sx={{ fontSize: '20px', fontWeight: 500, textTransform: 'capitalize', ml: 1 }}>
            {calendarTitle(view, anchor)}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body1" color="text.secondary">
          {count} citas con los filtros actuales.
        </Typography>
      )}

      <ToggleButtonGroup
        size="small"
        exclusive
        value={view}
        onChange={(_event, value: CalendarView | null) => value && onViewChange(value)}
      >
        <ToggleButton value="list">
          <ViewListIcon sx={{ fontSize: 16, mr: 0.5 }} /> Lista
        </ToggleButton>
        <ToggleButton value="week">
          <CalendarViewWeekIcon sx={{ fontSize: 16, mr: 0.5 }} /> Semana
        </ToggleButton>
        <ToggleButton value="month">
          <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} /> Mes
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}
