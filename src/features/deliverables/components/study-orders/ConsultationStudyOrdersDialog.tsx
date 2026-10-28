import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useConsultationStudyOrders, useDeleteStudyOrder } from '../../hooks/useStudyOrders'
import type { StudyOrder } from '../../types'
import { StudyOrderDialog } from './StudyOrderDialog'

type ConsultationStudyOrdersDialogProps = {
  open: boolean
  consultationId: number
  patientId: number
  readOnly: boolean
  onClose: () => void
}

function OrderRow({ order, readOnly, onOpen, onDelete }: {
  order: StudyOrder
  readOnly: boolean
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
          {order.items.map((item) => item.name).join(', ')}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {order.referralProvider ? `Dirigida a ${order.referralProvider.name}` : 'Sin destinatario'}
          {order.deliverableId ? ' · impresa' : ''}
        </Typography>
      </Stack>
      <Tooltip title={readOnly ? 'Ver' : 'Editar o imprimir'}>
        <IconButton size="small" onClick={onOpen}>
          {readOnly ? <VisibilityOutlinedIcon sx={{ fontSize: 18 }} /> : <EditOutlinedIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Tooltip>
      {!readOnly && (
        <Tooltip title="Eliminar">
          <IconButton size="small" onClick={onDelete}>
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  )
}

// Órdenes de estudio de la consulta: puede haber varias (una por centro).
export function ConsultationStudyOrdersDialog({ open, consultationId, patientId, readOnly, onClose }: ConsultationStudyOrdersDialogProps) {
  const { data: orders = [] } = useConsultationStudyOrders(consultationId)
  const remove = useDeleteStudyOrder()
  const [editing, setEditing] = useState<'new' | number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  return (
    <>
      <Dialog open={open && editing === null} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Órdenes de estudio</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 0.5 }}>
            {orders.length === 0 && <EmptyState message="Esta consulta no tiene órdenes de estudio." />}
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                readOnly={readOnly}
                onOpen={() => setEditing(order.id)}
                onDelete={() => setDeleting(order.id)}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <AppButton variant="text" onClick={onClose}>Cerrar</AppButton>
          {!readOnly && (
            <AppButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 18 }} />} onClick={() => setEditing('new')}>
              Nueva orden
            </AppButton>
          )}
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar orden de estudio"
        description="Se quita de la consulta. Si ya se imprimió, la copia sigue en el expediente."
        isConfirming={remove.isPending}
        onConfirm={() => deleting !== null && remove.mutate(deleting, { onSuccess: () => setDeleting(null) })}
        onClose={() => setDeleting(null)}
      />
      <StudyOrderDialog
        open={open && editing !== null}
        orderId={typeof editing === 'number' ? editing : null}
        patientId={patientId}
        consultationId={consultationId}
        readOnly={readOnly}
        onClose={() => setEditing(null)}
      />
    </>
  )
}
