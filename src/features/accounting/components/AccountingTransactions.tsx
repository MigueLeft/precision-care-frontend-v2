import { useState } from 'react'
import { Alert, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useAccountingTransactions } from '../hooks/useAccounting'
import type { AccountingTransactionFilters } from '../types'
import { AccountingTransactionsTable } from './AccountingTransactionsTable'
import { AccountingPagination } from './AccountingPagination'

const DEFAULT_FILTERS: AccountingTransactionFilters = { page: 1, pageSize: 25, status: 'all', from: '', to: '' }

export function AccountingTransactions() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const valid = !filters.from || !filters.to || filters.from <= filters.to
  const query = useAccountingTransactions(filters, valid)
  const update = (patch: Partial<AccountingTransactionFilters>) => setFilters({ ...filters, ...patch, page: 1 })
  return (
    <Stack spacing={2}>
      <Typography color="text.secondary">Historial de cobros, ordenado por fecha de pago. Las transacciones anuladas conservan su importe y motivo.</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <TextField type="date" label="Pago desde" value={filters.from} onChange={(e) => update({ from: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }} />
        <TextField type="date" label="Pago hasta (inclusive)" value={filters.to} onChange={(e) => update({ to: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }} />
        <TextField select label="Estado" value={filters.status} sx={{ minWidth: 180 }}
          onChange={(e) => update({ status: e.target.value as AccountingTransactionFilters['status'] })}>
          <MenuItem value="all">Todas</MenuItem><MenuItem value="paid">Pagadas</MenuItem><MenuItem value="voided">Anuladas</MenuItem>
        </TextField>
        <Button onClick={() => setFilters(DEFAULT_FILTERS)}>Limpiar filtros</Button>
        <Button disabled={!valid || query.isFetching} onClick={() => void query.refetch()}>Actualizar</Button>
      </Stack>
      {!valid ? <Alert severity="warning">La fecha final debe ser posterior o igual a la inicial.</Alert> : (
        <QueryBoundary isLoading={query.isLoading} isError={query.isError} error={query.error}>
          <AccountingTransactionsTable transactions={query.data?.transactions ?? []} />
          <AccountingPagination page={filters.page} pageSize={filters.pageSize} total={query.data?.total ?? 0}
            label="Transacciones por página" onChange={(pagination) => setFilters({ ...filters, ...pagination })} />
        </QueryBoundary>
      )}
    </Stack>
  )
}
