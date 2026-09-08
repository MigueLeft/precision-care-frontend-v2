import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography } from '@mui/material'
import { patientsKeys, fetchPatient, usePatient } from '@/features/patients'
import { MedicalRecordShell } from '@/features/medical-record'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

// Sufijo "_" en el segmento padre: saca el expediente del layout de la lista de
// pacientes (que no tiene <Outlet />) y lo muestra como página propia.
export const Route = createFileRoute('/_app/pacientes_/$patientId')({
  loader: ({ context: { queryClient }, params: { patientId } }) =>
    queryClient.ensureQueryData({
      queryKey: patientsKeys.detail(Number(patientId)),
      queryFn: () => fetchPatient(Number(patientId)),
    }),
  component: MedicalRecordLayout,
  errorComponent: MedicalRecordError,
})

function MedicalRecordError({ error }: { error: unknown }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" color="error" sx={{ mb: 1 }}>
        No se pudo cargar el expediente
      </Typography>
      <Typography color="text.secondary">
        {getApiErrorMessage(error, 'Ocurrió un error inesperado.')}
      </Typography>
    </Box>
  )
}

function MedicalRecordLayout() {
  const { patientId } = Route.useParams()
  const { data: patient } = usePatient(Number(patientId))

  if (!patient) return null

  return <MedicalRecordShell patient={patient} />
}
