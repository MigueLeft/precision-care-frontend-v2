import { Box, Stack, SwipeableDrawer, Typography } from '@mui/material'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { AppButton } from '@/components/AppButton'
import { formatPhone } from '@/utils/phone'
import type { Appointment } from '../../types'
import { formatTime } from '../../utils/calendar-dates'
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_STATUS_LABELS,
  getPrimarySpecialistName,
  isCancelled,
} from '../../utils/appointment-helpers'
import { ConfirmAppointmentButton } from '../ConfirmAppointmentButton'
import { useCan } from '@/features/identity'

type AgendaAppointmentSheetProps = {
  appointment: Appointment | null
  onClose: () => void
  onCancel: (appointment: Appointment) => void
}

const FULL_DATE = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '15px' }}>{value}</Typography>
    </Box>
  )
}

// Detalle de la cita como hoja inferior: datos, contacto del paciente y
// acciones (confirmar / quitar confirmación / cancelar).
export function AgendaAppointmentSheet({ appointment, onClose, onCancel }: AgendaAppointmentSheetProps) {
  const { can } = useCan()
  const phone = appointment?.patientPhone ?? null
  const start = appointment ? new Date(appointment.startAtUtc) : null
  const end = appointment ? new Date(appointment.endAtUtc) : null

  return (
    // Se cierra arrastrando hacia abajo (como las hojas del teléfono).
    <SwipeableDrawer
      anchor="bottom"
      open={!!appointment}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      slotProps={{ paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 'calc(env(safe-area-inset-bottom) + 16px)' } } }}
    >
      {appointment && start && end && (
        <Stack spacing={2} sx={{ p: 2.5 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto' }} />
          <Box>
            <Typography sx={{ fontSize: '19px', fontWeight: 700 }}>{appointment.patientName ?? 'Paciente'}</Typography>
            <Typography sx={{ fontSize: '14px', color: 'text.secondary', textTransform: 'capitalize' }}>
              {FULL_DATE.format(start)} · {formatTime(start)} – {formatTime(end)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Detail label="Estado" value={APPOINTMENT_STATUS_LABELS[appointment.status]} />
            <Detail label="Modalidad" value={APPOINTMENT_MODALITY_LABELS[appointment.modality]} />
            <Detail label="Médico" value={getPrimarySpecialistName(appointment) ?? '—'} />
          </Stack>
          {appointment.reason && <Detail label="Motivo" value={appointment.reason} />}
          {phone && <Detail label="Teléfono" value={formatPhone(phone) ?? phone} />}

          {phone && (
            <Stack direction="row" spacing={1}>
              <AppButton fullWidth variant="outlined" startIcon={<PhoneOutlinedIcon />} href={`tel:${phone}`}>
                Llamar
              </AppButton>
              <AppButton
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<WhatsAppIcon />}
                href={`https://wa.me/${phone.replace(/\D/g, '')}`}
              >
                WhatsApp
              </AppButton>
            </Stack>
          )}

          {!isCancelled(appointment.status) && (
            <Stack spacing={1}>
              <ConfirmAppointmentButton appointment={appointment} />
              {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && can('citas:update') && (
                <AppButton variant="outlined" color="error" startIcon={<CancelOutlinedIcon />} onClick={() => onCancel(appointment)}>
                  Cancelar cita
                </AppButton>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </SwipeableDrawer>
  )
}
