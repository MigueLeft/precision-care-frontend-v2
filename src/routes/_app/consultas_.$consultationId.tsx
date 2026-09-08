import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography } from '@mui/material'
import {
  ConsultationEncounterPage,
  consultationsKeys,
  fetchConsultation,
} from '@/features/consultations'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export const Route = createFileRoute('/_app/consultas_/$consultationId')({
  loader: ({ context: { queryClient }, params: { consultationId } }) =>
    queryClient.ensureQueryData({
      queryKey: consultationsKeys.detail(Number(consultationId)),
      queryFn: () => fetchConsultation(Number(consultationId)),
    }),
  component: ConsultationEncounterRoute,
  errorComponent: ConsultationEncounterError,
})

function ConsultationEncounterError({ error }: { error: unknown }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" color="error" sx={{ mb: 1 }}>
        No se pudo cargar la consulta
      </Typography>
      <Typography color="text.secondary">
        {getApiErrorMessage(error, 'Ocurrió un error inesperado.')}
      </Typography>
    </Box>
  )
}

function ConsultationEncounterRoute() {
  const { consultationId } = Route.useParams()
  return <ConsultationEncounterPage consultationId={Number(consultationId)} />
}
