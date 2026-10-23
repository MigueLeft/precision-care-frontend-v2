import { alpha, Box, Tooltip, Typography } from '@mui/material'
import type { Appointment } from '../../types'
import { appointmentColor, isUnconfirmed } from '../../utils/calendar-colors'
import { formatTime } from '../../utils/calendar-dates'
import { getPrimarySpecialistName } from '../../utils/appointment-helpers'

type CalendarEventCardProps = {
  appointment: Appointment
  // compact: chip de una línea (vista de mes).
  compact?: boolean
  onClick: (id: number) => void
}

// Tarjeta de una cita. Confirmada = relleno de color del médico; sin
// confirmar = fondo claro con borde (como un evento tentativo de Google).
export function CalendarEventCard({ appointment, compact = false, onClick }: CalendarEventCardProps) {
  const color = appointmentColor(appointment)
  const unconfirmed = isUnconfirmed(appointment)
  const start = new Date(appointment.startAtUtc)
  const end = new Date(appointment.endAtUtc)
  const patient = appointment.patientName ?? 'Paciente'
  const doctor = getPrimarySpecialistName(appointment)
  const tooltip = `${patient} · ${formatTime(start)} – ${formatTime(end)}${doctor ? ` · ${doctor}` : ''}${unconfirmed ? ' · Sin confirmar' : ''}`

  return (
    <Tooltip title={tooltip} placement="top" enterDelay={400} disableInteractive>
      <Box
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation()
          onClick(appointment.id)
        }}
        onKeyDown={(event) => event.key === 'Enter' && onClick(appointment.id)}
        sx={{
          height: '100%',
          px: 0.75,
          py: compact ? 0.125 : 0.5,
          borderRadius: '4px',
          overflow: 'hidden',
          cursor: 'pointer',
          bgcolor: unconfirmed ? 'background.paper' : color,
          color: unconfirmed ? color : 'common.white',
          border: `1px solid ${unconfirmed ? color : 'transparent'}`,
          borderLeft: unconfirmed ? `4px solid ${color}` : undefined,
          backgroundImage: unconfirmed
            ? `repeating-linear-gradient(-45deg, transparent 0 6px, ${alpha(color, 0.08)} 6px 12px)`
            : undefined,
          '&:hover': { boxShadow: 2, filter: unconfirmed ? undefined : 'brightness(1.05)' },
        }}
      >
        {compact ? (
          <Typography noWrap sx={{ fontSize: '12px', lineHeight: 1.6, fontWeight: 500, color: 'inherit' }}>
            {formatTime(start)} {patient}
          </Typography>
        ) : (
          <>
            <Typography noWrap sx={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3, color: 'inherit' }}>
              {patient}
            </Typography>
            <Typography noWrap sx={{ fontSize: '11px', lineHeight: 1.3, opacity: 0.9, color: 'inherit' }}>
              {formatTime(start)} – {formatTime(end)}
              {unconfirmed ? ' · Sin confirmar' : ''}
            </Typography>
          </>
        )}
      </Box>
    </Tooltip>
  )
}
