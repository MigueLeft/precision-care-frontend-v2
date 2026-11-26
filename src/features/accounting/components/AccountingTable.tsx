import { Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useCan } from '@/features/identity'
import { EmptyState } from '@/components/EmptyState'
import type { AccountingAppointment } from '../types'
import { formatAmount, formatPaymentDate } from '../utils/accounting-format'

type Props = { appointments: AccountingAppointment[]; onPay: (a: AccountingAppointment) => void; onPrice: (a: AccountingAppointment) => void; onVoid: (a: AccountingAppointment) => void }
export function AccountingTable({ appointments, onPay, onPrice, onVoid }: Props) {
  const { can } = useCan()
  if (!appointments.length) return <EmptyState message="No hay citas para este estado de pago." />
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" sx={{ minWidth: 850 }}>
        <TableHead><TableRow>{['Fecha de cita', 'Paciente / especialista', 'Precio (USD)', 'Descuento', 'Total (USD)', 'Pago', 'Acciones'].map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead>
        <TableBody>{appointments.map((a) => {
          const excluded = ['cancelled_by_patient', 'cancelled_by_clinic', 'no_show'].includes(a.status)
          return (
            <TableRow key={a.id} hover>
              <TableCell>{new Date(a.startAtUtc).toLocaleDateString('es-VE')}</TableCell>
              <TableCell><Typography sx={{ fontWeight: 600 }}>{a.patientName}</Typography><Typography variant="body2" color="text.secondary">{a.paidSpecialistName ?? a.specialistName ?? 'Sin especialista'}</Typography></TableCell>
              <TableCell>{formatAmount(a.basePrice)}</TableCell>
              <TableCell>{a.discountPercent} %</TableCell>
              <TableCell sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatAmount(a.paidAt ? a.paidAmount : a.total)}</TableCell>
              <TableCell>
                <Stack spacing={0.5} sx={{ alignItems: 'flex-start' }}>
                  <Chip size="small" label={a.paidAt ? 'Pagada' : 'Por pagar'} color={a.paidAt ? 'success' : 'warning'} />
                  {a.paidAt && <><Chip size="small" variant="outlined" label={a.paymentMethodName} sx={{ borderColor: a.paymentMethodColor, borderLeftWidth: 5 }} /><Typography variant="caption">{a.paymentDate ? formatPaymentDate(a.paymentDate) : new Date(a.paidAt).toLocaleDateString('es-VE')}</Typography></>}
                  {excluded && <Typography variant="caption" color="text.secondary">{a.status === 'no_show' ? 'No asistió' : 'Cancelada'} · excluida de cuentas por cobrar</Typography>}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {!a.paidAt && !excluded && can('contabilidad:create') && <Button variant="contained" size="small" onClick={() => onPay(a)}>Pagar</Button>}
                  {!a.paidAt && can('contabilidad:update') && <Button size="small" onClick={() => onPrice(a)}>Precio</Button>}
                  {a.paidAt && can('contabilidad:delete') && <Button color="error" size="small" onClick={() => onVoid(a)}>Anular</Button>}
                </Stack>
              </TableCell>
            </TableRow>
          )
        })}</TableBody>
      </Table>
    </TableContainer>
  )
}
