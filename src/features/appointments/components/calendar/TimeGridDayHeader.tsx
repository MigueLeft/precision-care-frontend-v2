import { Box, ButtonBase, Typography } from '@mui/material'
import { isSameDay, weekdayShort } from '../../utils/calendar-dates'

type TimeGridDayHeaderProps = {
  day: Date
  now: Date
  // Clic en el número: abre la vista de ese día.
  onClick?: (day: Date) => void
}

// Encabezado de un día: abreviatura del día y número (hoy resaltado).
export function TimeGridDayHeader({ day, now, onClick }: TimeGridDayHeaderProps) {
  const today = isSameDay(day, now)

  return (
    <Box sx={{ textAlign: 'center', py: 1 }}>
      <Typography
        sx={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: today ? 'primary.main' : 'text.secondary' }}
      >
        {weekdayShort(day)}
      </Typography>
      <ButtonBase
        onClick={() => onClick?.(day)}
        disabled={!onClick}
        aria-label={`Ver el día ${day.getDate()}`}
        sx={{
          mt: 0.25,
          width: 40,
          height: 40,
          borderRadius: '50%',
          fontSize: '22px',
          bgcolor: today ? 'primary.main' : 'transparent',
          color: today ? 'primary.contrastText' : 'text.primary',
          '&:hover': { bgcolor: today ? 'primary.dark' : 'action.hover' },
        }}
      >
        {day.getDate()}
      </ButtonBase>
    </Box>
  )
}
