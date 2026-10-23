import { alpha, Box, ButtonBase, Chip, Stack, Typography } from '@mui/material'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import type { Appointment } from '../../types'
import { appointmentColor, isUnconfirmed } from '../../utils/calendar-colors'
import { formatTime } from '../../utils/calendar-dates'
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  getPrimarySpecialistName,
} from '../../utils/appointment-helpers'

type AgendaAppointmentCardProps = {
  appointment: Appointment
  // Con varios médicos en la lista, se muestra de quién es la cita.
  showDoctor: boolean
  onOpen: (appointment: Appointment) => void
}

// Una cita en la agenda del teléfono: hora, paciente y estado. Las sin
// confirmar llevan borde punteado.
export function AgendaAppointmentCard({ appointment, showDoctor, onOpen }: AgendaAppointmentCardProps) {
  const color = appointmentColor(appointment)
  const unconfirmed = isUnconfirmed(appointment)
  const start = new Date(appointment.startAtUtc)
  const end = new Date(appointment.endAtUtc)

  return (
    <ButtonBase
      onClick={() => onOpen(appointment)}
      sx={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'stretch',
        borderRadius: '12px',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderStyle: unconfirmed ? 'dashed' : 'solid',
        borderColor: unconfirmed ? color : 'divider',
        '&:active': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06) },
      }}
    >
      <Box sx={{ width: 6, bgcolor: color, flexShrink: 0 }} />
      {/* La hora siempre en una sola línea ("9:00 a. m."); debajo, el fin. */}
      <Box sx={{ width: 96, py: 1.5, px: 1.25, flexShrink: 0, whiteSpace: 'nowrap' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatTime(start)}</Typography>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary', whiteSpace: 'nowrap' }}>{formatTime(end)}</Typography>
      </Box>
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, py: 1.5, pr: 1.5 }}>
        <Typography noWrap sx={{ fontSize: '15px', fontWeight: 600 }}>
          {appointment.patientName ?? 'Paciente'}
        </Typography>
        {showDoctor && (
          <Typography noWrap sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
            {getPrimarySpecialistName(appointment) ?? 'Sin médico'}
          </Typography>
        )}
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Chip
            size="small"
            label={APPOINTMENT_STATUS_LABELS[appointment.status]}
            color={APPOINTMENT_STATUS_COLORS[appointment.status]}
            variant={unconfirmed ? 'outlined' : 'filled'}
            sx={{ height: 22, fontSize: '11.5px' }}
          />
          {appointment.modality === 'telemedicine' && (
            <VideocamOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Stack>
      </Stack>
    </ButtonBase>
  )
}
