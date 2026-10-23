import { useState } from 'react'
import { Box, Drawer, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useNutritionRecallDetail } from '../hooks/useNutritionRecallQueries'
import { MarkdownContent } from './MarkdownContent'
import { NutritionRecallReportActions } from './NutritionRecallReportActions'
import { NutritionRecallTranscript } from './NutritionRecallTranscript'

type NutritionRecallReportDrawerProps = {
  recallId: number | null
  onClose: () => void
}

// Recordatorio de 24 Horas completado: reporte (se genera aquí a partir de la
// transcripción) y la entrevista completa. Se usa en el expediente y la consulta.
export function NutritionRecallReportDrawer({ recallId, onClose }: NutritionRecallReportDrawerProps) {
  const { data, isLoading, isError, error } = useNutritionRecallDetail(recallId)
  const [tab, setTab] = useState(0)

  return (
    <Drawer anchor="right" open={recallId !== null} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 640 }, p: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>Recordatorio de 24 Horas</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Stack>
        <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
          {data && (
            <Stack spacing={2}>
              {data.completed && <NutritionRecallReportActions recall={data} />}
              <Tabs value={tab} onChange={(_, value: number) => setTab(value)}>
                <Tab label="Reporte" />
                <Tab label={`Transcripción (${data.transcript.length})`} />
              </Tabs>
              {tab === 0 &&
                (data.reportMarkdown ? (
                  <MarkdownContent>{data.reportMarkdown}</MarkdownContent>
                ) : (
                  <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                    Aún no se ha generado el reporte.
                  </Typography>
                ))}
              {tab === 1 && <NutritionRecallTranscript transcript={data.transcript} />}
            </Stack>
          )}
        </QueryBoundary>
      </Box>
    </Drawer>
  )
}
