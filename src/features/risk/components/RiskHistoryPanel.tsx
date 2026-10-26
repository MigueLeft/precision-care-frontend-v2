import { Paper, Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewRisk, useMe } from '@/features/identity'
import { useRiskHistory, useRiskOverview } from '../hooks/useRisk'
import { RiskOverviewContent } from './RiskOverviewContent'
import { RiskTrend } from './RiskTrend'

// Pestaña "Riesgo" del expediente: estado vigente e histórico con tendencia.
export function RiskHistoryPanel({ patientId }: { patientId: number }) {
  const { data: me } = useMe()
  if (!canViewRisk(me)) return <EmptyState message="No tienes permiso para ver los scores de riesgo." />
  return <RiskHistoryContent patientId={patientId} />
}

function RiskHistoryContent({ patientId }: { patientId: number }) {
  const overview = useRiskOverview(patientId)
  const history = useRiskHistory(patientId)

  return (
    <Stack spacing={2}>
      <QueryBoundary isLoading={overview.isLoading} isError={overview.isError} error={overview.error}>
        {overview.data && <RiskOverviewContent overview={overview.data} consultationId={null} readOnly />}
      </QueryBoundary>
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>Histórico</Typography>
        <QueryBoundary isLoading={history.isLoading} isError={history.isError} error={history.error}>
          {history.data && <RiskTrend calculations={history.data} />}
        </QueryBoundary>
      </Paper>
    </Stack>
  )
}
