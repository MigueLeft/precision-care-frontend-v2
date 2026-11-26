import { useState } from 'react'
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useAccountingAppointments } from '../hooks/useAccounting'
import type { AccountingAppointment, AccountingFilters } from '../types'
import { AccountingTable } from './AccountingTable'
import { PaymentDialog } from './PaymentDialog'
import { VoidPaymentDialog } from './VoidPaymentDialog'
import { AccountingPagination } from './AccountingPagination'

export function AccountingAppointments() {
  const [filters, setFilters] = useState<AccountingFilters>({ page: 1, pageSize: 25, status: 'all' })
  const [dialog, setDialog] = useState<{ appointment: AccountingAppointment; mode: 'pay' | 'price' | 'void' } | null>(null)
  const query = useAccountingAppointments(filters)
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
        <TextField select label="Estado de pago" value={filters.status} sx={{ minWidth: 200 }} onChange={(e) => setFilters({ ...filters, page: 1, status: e.target.value as AccountingFilters['status'] })}>
          <MenuItem value="all">Todas las citas</MenuItem><MenuItem value="unpaid">Por pagar</MenuItem><MenuItem value="paid">Pagadas</MenuItem>
        </TextField>
        <Typography color="text.secondary" sx={{ flex: 1 }}>De la fecha de cita más reciente a la más antigua · USD</Typography>
        <Button onClick={() => void query.refetch()} disabled={query.isFetching}>Actualizar</Button>
      </Stack>
      <QueryBoundary isLoading={query.isLoading} isError={query.isError} error={query.error}>
        <AccountingTable appointments={query.data?.appointments ?? []} onPay={(appointment) => setDialog({ appointment, mode: 'pay' })}
          onPrice={(appointment) => setDialog({ appointment, mode: 'price' })} onVoid={(appointment) => setDialog({ appointment, mode: 'void' })} />
        <AccountingPagination page={filters.page} pageSize={filters.pageSize} total={query.data?.total ?? 0}
          label="Citas por página" onChange={(pagination) => setFilters({ ...filters, ...pagination })} />
      </QueryBoundary>
      {dialog && (dialog.mode === 'void' ? <VoidPaymentDialog appointment={dialog.appointment} onClose={() => setDialog(null)} />
        : <PaymentDialog key={`${dialog.mode}-${dialog.appointment.id}`} appointment={dialog.appointment} mode={dialog.mode} onClose={() => setDialog(null)} />)}
    </Stack>
  )
}
