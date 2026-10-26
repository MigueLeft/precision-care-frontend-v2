import { Box, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { SectionDensityContext } from '@/components/ui/section-density'
import { AnthropometryPreloadSection } from '@/features/anthropometry'
import { ParaclinicalSection, PreloadClinicalNotes } from '@/features/consultations'
import { MedicationsPanel } from '@/features/patient-medications'
import { useAppointment } from '../hooks/useAppointments'
import { useUpdatePreloadNotes } from '../hooks/useAppointmentMutations'

// Precarga de la consulta desde la cita: antropometría, paraclínicos,
// tratamiento y notas clínicas (enfermedad actual, nota evolutiva, planes y
// problemas) quedan listos antes de que el especialista inicie la consulta.
export function ConsultationPreloadPage({ appointmentId }: { appointmentId: number }) {
  const navigate = useNavigate()
  const { data: appointment, isLoading, isError, error } = useAppointment(appointmentId)
  const saveNotes = useUpdatePreloadNotes(appointmentId)

  if (isLoading || isError || !appointment) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  const start = new Date(appointment.startAtUtc)
  const canPreload = appointment.status === 'scheduled' || appointment.status === 'confirmed'

  return (
    <Box>
      <AppButton
        variant="text"
        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate({ to: '/citas' })}
        sx={{ mb: 1 }}
      >
        Volver a citas
      </AppButton>
      <Typography variant="h1">Precargar datos de la consulta</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {appointment.patientName ?? 'Paciente'} ·{' '}
        {start.toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short', hour12: true })}
      </Typography>

      {canPreload ? (
          <SectionDensityContext.Provider value="compact">
          <Stack spacing={1}>
            <AnthropometryPreloadSection
              index={1}
              appointmentId={appointment.id}
              patientId={appointment.patientId}
            />
            <ParaclinicalSection index={2} patientId={appointment.patientId} readOnly={false} />
            <CollapsibleSection title="3. Tratamiento" defaultExpanded>
              <MedicationsPanel patientId={appointment.patientId} />
            </CollapsibleSection>
            <PreloadClinicalNotes
              startIndex={4}
              notes={appointment.preloadNotes ?? {}}
              onSave={(patch) => saveNotes.mutate(patch)}
            />
        </Stack>
        </SectionDensityContext.Provider>
      ) : (
        <EmptyState message="La consulta de esta cita ya inició o la cita no está vigente: captura los datos dentro de la consulta." />
      )}
    </Box>
  )
}
