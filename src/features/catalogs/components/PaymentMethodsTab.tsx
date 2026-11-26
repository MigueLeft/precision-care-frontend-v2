import { useState } from 'react'
import { Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { useCan } from '@/features/identity'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { EmptyState } from '@/components/EmptyState'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useDeletePaymentMethod, usePaymentMethods } from '../hooks/usePaymentMethods'
import { PaymentMethodForm } from './PaymentMethodForm'
import type { PaymentMethod } from '../types/payment-method'

export function PaymentMethodsTab() {
  const { can } = useCan()
  const query = usePaymentMethods()
  const [editing, setEditing] = useState<PaymentMethod | 'new' | null>(null)
  const [deleting, setDeleting] = useState<PaymentMethod | null>(null)
  const remove = useDeletePaymentMethod(() => setDeleting(null))
  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">Métodos de pago</Typography>
        {can('catalogos:create') && <Button variant="contained" onClick={() => setEditing('new')}>Nuevo método</Button>}
      </Stack>
      <Typography color="text.secondary">Define el nombre y color de tarjeta, pago móvil, Zelle y los demás métodos aceptados.</Typography>
      <QueryBoundary isLoading={query.isLoading} isError={query.isError} error={query.error}>
        {!query.data?.length && <EmptyState message="Todavía no hay métodos de pago. Crea el primero para registrar cobros." />}
        {query.data?.map((method) => (
          <Paper key={method.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
              <Chip label={method.name} variant="outlined" sx={{ borderColor: method.color, borderLeftWidth: 6 }} />
              <Typography color="text.secondary" sx={{ flex: 1 }}>{method.active ? 'Activo' : 'Inactivo'}</Typography>
              {can('catalogos:update') && <Button onClick={() => setEditing(method)}>Editar</Button>}
              {can('catalogos:delete') && <Button color="error" onClick={() => setDeleting(method)}>Eliminar</Button>}
            </Stack>
          </Paper>
        ))}
      </QueryBoundary>
      {editing && <PaymentMethodForm key={editing === 'new' ? 'new' : editing.id} method={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog open={!!deleting} title="Eliminar método de pago" description={`Se eliminará ${deleting?.name ?? ''} de los nuevos cobros. Los pagos anteriores conservarán sus datos.`}
        isConfirming={remove.isPending} onClose={() => setDeleting(null)} onConfirm={() => deleting && remove.mutate(deleting.id)} />
    </Stack>
  )
}
