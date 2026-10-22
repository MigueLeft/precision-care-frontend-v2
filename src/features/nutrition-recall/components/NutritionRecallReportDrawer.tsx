import { Alert, Box, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useNutritionRecallDetail } from '../hooks/useNutritionRecallQueries'
import { MarkdownContent } from './MarkdownContent'

type NutritionRecallReportDrawerProps = {
  recallId: number | null
  onClose: () => void
}

// Reporte nutricional generado por NutriBot, tal como se envió en el PDF.
export function NutritionRecallReportDrawer({ recallId, onClose }: NutritionRecallReportDrawerProps) {
  const { data, isLoading, isError, error } = useNutritionRecallDetail(recallId)

  return (
    <Drawer anchor="right" open={recallId !== null} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 640 }, p: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>Recordatorio de 24 Horas</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Stack>
        <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
          {data?.reportMarkdown ? (
            <MarkdownContent>{data.reportMarkdown}</MarkdownContent>
          ) : (
            <Alert severity="warning">
              El reporte no se pudo generar
              {data?.reportError ? ` (${data.reportError})` : ''}. La transcripción de la entrevista se
              envió al equipo de nutrición para elaborarlo manualmente.
            </Alert>
          )}
        </QueryBoundary>
      </Box>
    </Drawer>
  )
}
