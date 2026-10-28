import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material'
import { useMe, useSpecialistsLookup } from '@/features/identity'
import { usePrintStudyOrder, useSaveStudyOrder, useStudyOrder } from '../../hooks/useStudyOrders'
import { printDeliverable } from '../../utils/print-deliverable'
import type { StudyOrder, StudyOrderData } from '../../types'
import { DeliverableDialogActions } from '../DeliverableDialogActions'
import { ProviderPicker } from './ProviderPicker'
import { StudyItemsPicker } from './StudyItemsPicker'
import { useStudyOrderForm } from './useStudyOrderForm'

type StudyOrderDialogProps = {
  open: boolean
  // null = orden nueva.
  orderId: number | null
  patientId: number
  // Sin consulta = orden del expediente (se elige el médico que firma).
  consultationId?: number
  readOnly?: boolean
  onClose: () => void
}

type ContentProps = Omit<StudyOrderDialogProps, 'open' | 'orderId'> & {
  order: StudyOrder | null
  defaultSpecialistId: number | null
}

// Se monta al abrir: nace con la orden guardada (o vacía si es nueva).
function StudyOrderContent({ order, patientId, consultationId, readOnly = false, defaultSpecialistId, onClose }: ContentProps) {
  const [orderId, setOrderId] = useState(order?.id ?? null)
  const { form, set, dirty, payload, markSaved } = useStudyOrderForm(order, defaultSpecialistId)
  const { data: specialists = [] } = useSpecialistsLookup()
  const save = useSaveStudyOrder(orderId)
  const print = usePrintStudyOrder()
  const fromRecord = consultationId === undefined

  async function handleSave() {
    try {
      const saved = await save.mutateAsync({ ...payload(), patientId, consultationId })
      setOrderId(saved.id)
      markSaved(saved)
    } catch { /* toast */ }
  }

  async function handlePrint() {
    if (orderId === null) return
    try {
      const { deliverable } = await print.mutateAsync(orderId)
      printDeliverable({ type: 'study_order', data: deliverable.data as unknown as StudyOrderData })
    } catch { /* toast */ }
  }

  return (
    <>
      <DialogTitle>{orderId === null ? 'Nueva orden de estudio' : 'Orden de estudio'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fromRecord && (
            <TextField
              select
              label="Médico que firma"
              value={form.specialistId ?? ''}
              onChange={(event) => set('specialistId')(Number(event.target.value))}
              disabled={readOnly}
            >
              {specialists
                .filter((s) => s.active || s.id === form.specialistId)
                .map((s) => (
                  <MenuItem key={s.id} value={s.id}>{`${s.name} ${s.lastName}`}</MenuItem>
                ))}
            </TextField>
          )}
          <ProviderPicker value={form.provider} onChange={set('provider')} disabled={readOnly} />
          <StudyItemsPicker value={form.items} onChange={set('items')} disabled={readOnly} />
          <TextField
            label="Indicaciones"
            placeholder="Preparación, ayuno, motivo del estudio…"
            multiline
            minRows={2}
            value={form.indications}
            onChange={(event) => set('indications')(event.target.value)}
            disabled={readOnly}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
          />
        </Stack>
      </DialogContent>
      <DeliverableDialogActions
        readOnly={readOnly}
        dirty={dirty}
        hasSaved={orderId !== null}
        canSave={form.items.length > 0 && (!fromRecord || form.specialistId !== null)}
        saving={save.isPending}
        printing={print.isPending}
        onClose={onClose}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    </>
  )
}

export function StudyOrderDialog({ open, orderId, ...props }: StudyOrderDialogProps) {
  const { data: order } = useStudyOrder(open ? orderId : null)
  const { data: me } = useMe()
  const ready = open && (orderId === null || !!order)
  return (
    // Sin cierre por clic afuera: los cambios se guardan con "Guardar".
    <Dialog open={ready} maxWidth="md" fullWidth>
      {ready && (
        <StudyOrderContent {...props} order={order ?? null} defaultSpecialistId={me?.specialistId ?? null} />
      )}
    </Dialog>
  )
}
