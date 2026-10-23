import { alpha, Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { formatTime } from '../../utils/calendar-dates'

type SlotHoverGhostProps = {
  day: Date
  // Media hora (0–47) bajo el puntero.
  slot: number
  slotHeight: number
}

// Vista previa del hueco bajo el puntero: indica que con un clic se crea una
// cita a esa hora (como el "evento fantasma" de Google Calendar).
export function SlotHoverGhost({ day, slot, slotHeight }: SlotHoverGhostProps) {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(slot / 2), slot % 2 ? 30 : 0)

  return (
    <Box
      sx={{
        position: 'absolute',
        top: slot * slotHeight,
        height: slotHeight,
        left: 2,
        right: 2,
        zIndex: 0,
        pointerEvents: 'none',
        borderRadius: '4px',
        border: '1px dashed',
        borderColor: 'primary.main',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 0.75,
        color: 'primary.main',
      }}
    >
      <AddIcon sx={{ fontSize: 14 }} />
      <Typography noWrap sx={{ fontSize: '11px', fontWeight: 600, color: 'inherit' }}>
        {formatTime(start)}
      </Typography>
    </Box>
  )
}
