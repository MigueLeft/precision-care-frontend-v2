import { Paper, Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import type { AccountingGroup } from '../types'
import { formatAmount } from '../utils/accounting-format'

type Props = { title: string; rows: AccountingGroup[] }
export function AccountingBreakdown({ title, rows }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, flex: 1, minWidth: 0 }}>
      <Typography variant="h2" sx={{ mb: 2 }}>{title}</Typography>
      {!rows.length && <EmptyState message="Sin ingresos en este período." />}
      <Stack spacing={0}>
        {rows.map((row, index) => (
          <Stack key={`${row.id}-${index}`} direction="row" spacing={2} sx={{ justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', borderLeft: row.color ? '4px solid' : undefined, borderLeftColor: row.color, pl: row.color ? 1.5 : 0 }}>
            <Stack sx={{ minWidth: 0 }}><Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{row.name}</Typography><Typography variant="caption" color="text.secondary">{row.count} pagos</Typography></Stack>
            <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatAmount(row.amount)} USD</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  )
}
