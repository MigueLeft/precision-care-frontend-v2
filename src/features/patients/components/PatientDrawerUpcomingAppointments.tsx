import { Box, Chip, Stack, Typography, CircularProgress } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import {
  useAppointmentsByPatient,
  getUpcomingAppointments,
  getPrimarySpecialistName,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_MODALITY_LABELS,
} from '@/features/appointments'

interface PatientDrawerUpcomingAppointmentsProps {
  patientId: number
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function PatientDrawerUpcomingAppointments({
  patientId,
}: PatientDrawerUpcomingAppointmentsProps) {
  const { data = [], isLoading } = useAppointmentsByPatient(patientId)
  const upcoming = getUpcomingAppointments(data).slice(0, 3)

  return (
    <Box sx={{ px: 3, mt: 2 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'brand.dark', mb: 1 }}>
        Próximas citas
      </Typography>

      {isLoading && <CircularProgress size={20} />}

      {!isLoading && upcoming.length === 0 && (
        <EmptyState message="Sin citas próximas." />
      )}

      <Stack spacing={1}>
        {upcoming.map((appointment) => (
          <Box
            key={appointment.id}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                {formatDateTime(appointment.startAtUtc)}
              </Typography>
              <Chip label={APPOINTMENT_STATUS_LABELS[appointment.status]} size="small" />
            </Stack>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.5 }}>
              {appointment.reason ?? 'Sin motivo'} ·{' '}
              {APPOINTMENT_MODALITY_LABELS[appointment.modality]}
              {getPrimarySpecialistName(appointment)
                ? ` · ${getPrimarySpecialistName(appointment)}`
                : ''}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
