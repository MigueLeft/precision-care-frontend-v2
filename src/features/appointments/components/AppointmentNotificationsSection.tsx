import { Stack, Typography, Chip } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import type { Appointment } from '../types'

interface AppointmentNotificationsSectionProps {
  appointment: Appointment
}

// Lista unificada de "Recordatorios enviados": recordatorios de cita e
// ingresables asignados/notificados al paciente.
export function AppointmentNotificationsSection({
  appointment,
}: AppointmentNotificationsSectionProps) {
  const reminders = appointment.reminders ?? []
  const hasAny = reminders.length > 0 || appointment.intakeAssignments.length > 0

  return (
    <>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
        Recordatorios enviados
      </Typography>
      {hasAny ? (
        <Stack spacing={0.75}>
          {reminders.map((reminder) => (
            <Stack
              key={`reminder-${reminder.id}`}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography sx={{ fontSize: '12px' }}>
                {reminder.channel === 'email' ? 'Email' : 'WhatsApp'} ·{' '}
                {new Date(reminder.sentAt).toLocaleString('es-MX', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}{' '}
                · {reminder.recipient}
              </Typography>
            </Stack>
          ))}
          {appointment.intakeAssignments.map((assignment) => (
            <Stack
              key={`intake-${assignment.id}`}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              {assignment.completed ? (
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <HourglassEmptyOutlinedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              )}
              <Typography sx={{ fontSize: '12px', flex: 1 }}>
                Ingresable: {assignment.intakeName ?? '—'} ·{' '}
                {new Date(assignment.startAt).toLocaleString('es-MX', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </Typography>
              <Chip
                label={assignment.completed ? 'Completado' : 'Pendiente'}
                size="small"
                color={assignment.completed ? 'success' : 'warning'}
                variant="outlined"
              />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          Sin recordatorios enviados.
        </Typography>
      )}
    </>
  )
}
