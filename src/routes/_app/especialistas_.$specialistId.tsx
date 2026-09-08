import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography } from '@mui/material'
import { SpecialistDetailPage, specialistsKeys, fetchSpecialist } from '@/features/specialists'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export const Route = createFileRoute('/_app/especialistas_/$specialistId')({
  loader: ({ context: { queryClient }, params: { specialistId } }) =>
    queryClient.ensureQueryData({
      queryKey: specialistsKeys.detail(Number(specialistId)),
      queryFn: () => fetchSpecialist(Number(specialistId)),
    }),
  component: EspecialistaDetalleRoute,
  errorComponent: EspecialistaDetalleError,
})

function EspecialistaDetalleError({ error }: { error: unknown }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" color="error" sx={{ mb: 1 }}>
        No se pudo cargar el especialista
      </Typography>
      <Typography color="text.secondary">
        {getApiErrorMessage(error, 'Ocurrió un error inesperado.')}
      </Typography>
    </Box>
  )
}

function EspecialistaDetalleRoute() {
  const { specialistId } = Route.useParams()
  return <SpecialistDetailPage specialistId={Number(specialistId)} />
}
