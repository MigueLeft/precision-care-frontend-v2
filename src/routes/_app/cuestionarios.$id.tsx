import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography } from '@mui/material'
import { QuestionnaireBuilderPage, questionnairesKeys, fetchQuestionnaireDetailed } from '@/features/questionnaires'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export const Route = createFileRoute('/_app/cuestionarios/$id')({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData({
      queryKey: questionnairesKeys.detail(Number(id)),
      queryFn: () => fetchQuestionnaireDetailed(Number(id)),
    }),
  component: CuestionarioBuilderRoute,
  errorComponent: CuestionarioBuilderError,
})

function CuestionarioBuilderError({ error }: { error: unknown }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" color="error" sx={{ mb: 1 }}>
        No se pudo cargar el ingresable
      </Typography>
      <Typography color="text.secondary">{getApiErrorMessage(error, 'Ocurrió un error inesperado.')}</Typography>
    </Box>
  )
}

function CuestionarioBuilderRoute() {
  const { id } = Route.useParams()
  return <QuestionnaireBuilderPage questionnaireId={Number(id)} />
}
