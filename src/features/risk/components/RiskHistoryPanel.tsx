import { useState } from 'react'
import { Box, Paper, Stack, Tab, Tabs } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewRisk, useMe } from '@/features/identity'
import { useRiskHistory, useRiskOverview } from '../hooks/useRisk'
import { RiskOverviewContent } from './RiskOverviewContent'
import { RiskTrend } from './RiskTrend'

// Pestaña "Riesgo" del expediente: estado vigente e histórico con tendencia,
// cada uno en su propia pestaña.
export function RiskHistoryPanel({ patientId }: { patientId: number }) {
  const { data: me } = useMe()
  if (!canViewRisk(me)) return <EmptyState message="No tienes permiso para ver los scores de riesgo." />
  return <RiskHistoryContent patientId={patientId} />
}

function RiskHistoryContent({ patientId }: { patientId: number }) {
  const [tab, setTab] = useState(0)

  return (
    <Stack spacing={2}>
      <Tabs
        value={tab}
        onChange={(_, value: number) => setTab(value)}
        sx={{ minHeight: 34, '& .MuiTab-root': { minHeight: 34, fontSize: '13px' } }}
      >
        <Tab label="Actual" />
        <Tab label="Histórico" />
      </Tabs>
      <Box hidden={tab !== 0}>{tab === 0 && <CurrentRisk patientId={patientId} />}</Box>
      <Box hidden={tab !== 1}>{tab === 1 && <RiskHistory patientId={patientId} />}</Box>
    </Stack>
  )
}

function CurrentRisk({ patientId }: { patientId: number }) {
  const overview = useRiskOverview(patientId)
  return (
    <QueryBoundary isLoading={overview.isLoading} isError={overview.isError} error={overview.error}>
      {overview.data && <RiskOverviewContent overview={overview.data} consultationId={null} readOnly />}
    </QueryBoundary>
  )
}

function RiskHistory({ patientId }: { patientId: number }) {
  const history = useRiskHistory(patientId)
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <QueryBoundary isLoading={history.isLoading} isError={history.isError} error={history.error}>
        {history.data && <RiskTrend calculations={history.data} />}
      </QueryBoundary>
    </Paper>
  )
}
