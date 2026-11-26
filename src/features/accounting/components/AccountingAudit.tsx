import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useAccountingReport } from '../hooks/useAccounting'
import { currentMonthRange, formatAmount, reportRange } from '../utils/accounting-format'
import { AccountingBreakdown } from './AccountingBreakdown'

export function AccountingAudit() {
  const [dates, setDates] = useState(currentMonthRange)
  const range = reportRange(dates.from, dates.to)
  const query = useAccountingReport(range.from, range.to, range.valid)
  const report = query.data
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="date" label="Desde" value={dates.from} onChange={(e) => setDates({ ...dates, from: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField type="date" label="Hasta (inclusive)" value={dates.to} onChange={(e) => setDates({ ...dates, to: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
        <Button onClick={() => setDates(currentMonthRange())}>Mes actual</Button>
        <Button disabled={!range.valid || query.isFetching} onClick={() => void query.refetch()}>Actualizar</Button>
      </Stack>
      {!range.valid ? <Alert severity="warning">Selecciona un rango de fechas válido.</Alert> : (
        <QueryBoundary isLoading={query.isLoading} isError={query.isError} error={query.error}>
          {report && <>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Stack sx={{ flex: 2 }}><Typography color="text.secondary">Ingresos cobrados</Typography><Typography sx={{ fontSize: 28, fontWeight: 600, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>{formatAmount(report.income)} USD</Typography><Typography variant="caption">{report.paidCount} pagos · {formatAmount(report.discounts)} USD en descuentos</Typography></Stack>
                <Stack sx={{ flex: 1 }}><Typography color="text.secondary">Cuentas por cobrar</Typography><Typography variant="h2">{formatAmount(report.receivables.amount)} USD</Typography><Typography variant="caption">{report.receivables.count} citas pendientes del período</Typography></Stack>
              </Stack>
            </Paper>
            <Typography color="text.secondary" variant="body2">Los ingresos se calculan por fecha de pago. Las cuentas por cobrar corresponden a citas del rango seleccionado; excluyen cancelaciones y ausencias. Fechas en tu zona horaria local.</Typography>
            {report.receivables.unpricedCount > 0 && <Alert severity="warning">Hay {report.receivables.unpricedCount} citas sin precio. Sus importes aún no están incluidos en las cuentas por cobrar.</Alert>}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              <AccountingBreakdown title="Ingresos por especialista" rows={report.specialists} />
              <AccountingBreakdown title="Desglose por método de pago" rows={report.methods} />
            </Stack>
          </>}
        </QueryBoundary>
      )}
    </Stack>
  )
}
