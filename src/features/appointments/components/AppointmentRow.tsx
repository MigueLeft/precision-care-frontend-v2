import { TableRow, TableCell, Typography, Box, Stack, Chip } from '@mui/material'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { alpha } from '@mui/material/styles'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import type { Appointment } from '../types'
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  getDurationMinutes,
  getPrimarySpecialistName,
} from '../utils/appointment-helpers'

interface AppointmentRowProps {
  appointment: Appointment
  onView: () => void
}

function initials(name: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
}

export function AppointmentRow({ appointment, onView }: AppointmentRowProps) {
  const start = new Date(appointment.startAtUtc)
  const isToday = start.toDateString() === new Date().toDateString()
  const dateStr = start.toLocaleDateString('en-CA') // YYYY-MM-DD
  const timeStr = start.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <TableRow
      hover
      onClick={onView}
      sx={{
        cursor: 'pointer',
        bgcolor:
          appointment.status === 'in_progress'
            ? (theme) => alpha(theme.palette.secondary.main, 0.08)
            : undefined,
        '&:last-child td': { borderBottom: 0 },
      }}
    >
      <TableCell>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: isToday ? 'primary.main' : 'text.primary',
          }}
        >
          {dateStr}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {timeStr} · {getDurationMinutes(appointment)} min
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <InitialsAvatar initials={initials(appointment.patientName)} size={28} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
            {appointment.patientName ?? '—'}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>
          {getPrimarySpecialistName(appointment) ?? '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          {appointment.modality === 'telemedicine' ? (
            <VideocamOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          ) : (
            <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          )}
          <Typography sx={{ fontSize: '13px' }}>
            {APPOINTMENT_MODALITY_LABELS[appointment.modality]}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: 'text.secondary' }}>
          {appointment.reason ?? '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={APPOINTMENT_STATUS_LABELS[appointment.status]}
          size="small"
          color={APPOINTMENT_STATUS_COLORS[appointment.status]}
          variant={appointment.status === 'confirmed' ? 'filled' : 'outlined'}
        />
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
