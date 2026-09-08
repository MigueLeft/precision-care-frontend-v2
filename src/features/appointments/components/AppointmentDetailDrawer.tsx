import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Link,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { useAppointment } from '../hooks/useAppointments'
import { AppointmentActions } from './AppointmentActions'
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
  getDurationMinutes,
  getPrimarySpecialistName,
} from '../utils/appointment-helpers'

interface AppointmentDetailDrawerProps {
  appointmentId: number | null
  onClose: () => void
  onEdit: (id: number) => void
  onCancel: (id: number) => void
}

interface FieldProps {
  label: string
  value: string
}

function Field({ label, value }: FieldProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{value}</Typography>
    </Box>
  )
}

export function AppointmentDetailDrawer({
  appointmentId,
  onClose,
  onEdit,
  onCancel,
}: AppointmentDetailDrawerProps) {
  const { data: appointment, isLoading } = useAppointment(appointmentId ?? undefined)

  const start = appointment ? new Date(appointment.startAtUtc) : null
  const end = appointment ? new Date(appointment.endAtUtc) : null
  const timeFmt = (d: Date) =>
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <Drawer
      anchor="right"
      open={appointmentId !== null}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 440 } } }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em' }}>
              DETALLE DE CITA
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5 }}>
              {appointment?.patientName ?? '—'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>

        {isLoading && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress size={22} />
          </Box>
        )}

        {appointment && start && end && (
          <>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label={APPOINTMENT_STATUS_LABELS[appointment.status]}
                size="small"
                color={APPOINTMENT_STATUS_COLORS[appointment.status]}
              />
              <Chip
                icon={
                  appointment.modality === 'telemedicine' ? (
                    <VideocamOutlinedIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <PlaceOutlinedIcon sx={{ fontSize: 14 }} />
                  )
                }
                label={APPOINTMENT_MODALITY_LABELS[appointment.modality]}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Stack spacing={2} sx={{ mt: 3 }}>
              <Stack direction="row" spacing={4}>
                <Field label="Fecha" value={start.toLocaleDateString('en-CA')} />
                <Field
                  label="Horario"
                  value={`${timeFmt(start)} – ${timeFmt(end)} (${getDurationMinutes(appointment)} min)`}
                />
              </Stack>
              <Stack direction="row" spacing={4}>
                <Field label="Especialista" value={getPrimarySpecialistName(appointment) ?? '—'} />
                <Field
                  label="Tipo"
                  value={appointment.type ? APPOINTMENT_TYPE_LABELS[appointment.type] : '—'}
                />
              </Stack>
              <Field label="Motivo" value={appointment.reason ?? '—'} />
              {appointment.modality === 'telemedicine' ? (
                <Box>
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>
                    Enlace de telemedicina
                  </Typography>
                  {appointment.telemedicineLink ? (
                    <Link
                      href={appointment.telemedicineLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: '14px', fontWeight: 600, wordBreak: 'break-all' }}
                    >
                      {appointment.telemedicineLink}
                    </Link>
                  ) : (
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>—</Typography>
                  )}
                </Box>
              ) : (
                <Field label="Ubicación" value={appointment.location ?? '—'} />
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
              Recordatorios enviados
            </Typography>
            {appointment.reminders && appointment.reminders.length > 0 ? (
              <Stack spacing={0.75}>
                {appointment.reminders.map((reminder) => (
                  <Stack
                    key={reminder.id}
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
              </Stack>
            ) : (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                Sin recordatorios enviados.
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <AppointmentActions
              appointment={appointment}
              onEdit={() => onEdit(appointment.id)}
              onCancel={() => onCancel(appointment.id)}
            />
          </>
        )}
      </Box>
    </Drawer>
  )
}
