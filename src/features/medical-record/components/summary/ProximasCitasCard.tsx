import { Box, Chip, Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import {
  useAppointmentsByPatient,
  getUpcomingAppointments,
  getPrimarySpecialistName,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_MODALITY_LABELS,
} from '@/features/appointments'

interface ProximasCitasCardProps {
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

export function ProximasCitasCard({ patientId }: ProximasCitasCardProps) {
  const { data = [], isLoading } = useAppointmentsByPatient(patientId)
  const upcoming = getUpcomingAppointments(data).slice(0, 3)

  return (
    <SectionCard title="Próximas citas">
      {!isLoading && upcoming.length === 0 && (
        <EmptyState message="Sin citas próximas." />
      )}

      <Stack spacing={1.5}>
        {upcoming.map((appointment) => (
          <Box key={appointment.id}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                {formatDateTime(appointment.startAtUtc)}
              </Typography>
              <Chip label={APPOINTMENT_STATUS_LABELS[appointment.status]} size="small" />
            </Stack>
            <Typography sx={{ fontSize: '13px', color: 'text.primary', mt: 0.25 }}>
              {appointment.reason ?? 'Sin motivo'}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {APPOINTMENT_MODALITY_LABELS[appointment.modality]}
              {getPrimarySpecialistName(appointment)
                ? ` · ${getPrimarySpecialistName(appointment)}`
                : ''}
            </Typography>
          </Box>
        ))}
      </Stack>
    </SectionCard>
  )
}
