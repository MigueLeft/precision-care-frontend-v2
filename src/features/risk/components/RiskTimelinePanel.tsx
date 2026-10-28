import { useState } from 'react'
import { Chip, Paper, Stack, TablePagination } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewRisk, useMe } from '@/features/identity'
import { useRiskHistory } from '../hooks/useRisk'
import type { RiskCalculation } from '../types'
import { RiskTrend } from './RiskTrend'
import { CALCULATION_KIND_LABELS } from '../utils/cardio-labels'

type Kind = RiskCalculation['kind']

const KINDS = (Object.keys(CALCULATION_KIND_LABELS) as Kind[]).map((value) => ({
  value,
  label: CALCULATION_KIND_LABELS[value],
}))

// Pestaña "Histórico de riesgo": cálculos filtrados por tipo y paginados para
// que la tabla no crezca sin límite.
export function RiskTimelinePanel({ patientId }: { patientId: number }) {
  const { data: me } = useMe()
  if (!canViewRisk(me)) return <EmptyState message="No tienes permiso para ver los scores de riesgo." />
  return <RiskTimeline patientId={patientId} />
}

function RiskTimeline({ patientId }: { patientId: number }) {
  const history = useRiskHistory(patientId)
  const [kind, setKind] = useState<Kind>('findrisc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const rows = (history.data ?? []).filter((c) => c.kind === kind)

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 1.5, flexWrap: 'wrap' }}>
        {KINDS.map((k) => (
          <Chip
            key={k.value}
            label={k.label}
            color={k.value === kind ? 'primary' : 'default'}
            variant={k.value === kind ? 'filled' : 'outlined'}
            onClick={() => {
              setKind(k.value)
              setPage(0)
            }}
          />
        ))}
      </Stack>
      <QueryBoundary isLoading={history.isLoading} isError={history.isError} error={history.error}>
        {/* La tendencia compara con el cálculo anterior del mismo tipo, que puede estar en otra página. */}
        <RiskTrend calculations={rows} page={page} rowsPerPage={rowsPerPage} />
        {rows.length > rowsPerPage && (
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(_e, next) => setPage(next)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
            }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Filas"
          />
        )}
      </QueryBoundary>
    </Paper>
  )
}
