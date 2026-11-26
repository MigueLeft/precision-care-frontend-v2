import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import type { AccountingTransaction } from '../types'
import { formatAmount, formatPaymentDate } from '../utils/accounting-format'

type Props = { transactions: AccountingTransaction[] }
const HEADERS = ['Fecha de pago', 'Cita', 'Paciente / especialista', 'Método de pago', 'Descuento', 'Importe (USD)', 'Estado']

export function AccountingTransactionsTable({ transactions }: Props) {
  if (!transactions.length) return <EmptyState message="No hay transacciones para los filtros seleccionados." />
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow>{HEADERS.map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatPaymentDate(transaction.paymentDate)}</TableCell>
              <TableCell>#{transaction.appointmentId}</TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{transaction.patientName}</Typography>
                <Typography variant="body2" color="text.secondary">{transaction.specialistName ?? 'Sin especialista'}</Typography>
              </TableCell>
              <TableCell>
                <Chip size="small" variant="outlined" label={transaction.paymentMethodName ?? 'Sin método'}
                  sx={{ borderColor: transaction.paymentMethodColor, borderLeftWidth: 5 }} />
              </TableCell>
              <TableCell>{transaction.discountPercent} %</TableCell>
              <TableCell sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatAmount(transaction.amount)}</TableCell>
              <TableCell>
                <Stack spacing={0.5} sx={{ alignItems: 'flex-start', maxWidth: 260 }}>
                  <Chip size="small" label={transaction.status === 'voided' ? 'Anulada' : 'Pagada'}
                    color={transaction.status === 'voided' ? 'default' : 'success'} />
                  {transaction.voidReason && <Typography variant="caption" color="text.secondary">{transaction.voidReason}</Typography>}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
