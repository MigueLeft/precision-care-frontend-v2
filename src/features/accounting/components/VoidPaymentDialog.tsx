import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useVoidAppointmentPayment } from '../hooks/useAccounting'
import type { AccountingAppointment } from '../types'

const schema = z.object({ reason: z.string().trim().min(5, 'Explica el motivo (mínimo 5 caracteres).').max(500) })
type Props = { appointment: AccountingAppointment; onClose: () => void }
export function VoidPaymentDialog({ appointment, onClose }: Props) {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: { reason: '' } })
  const mutation = useVoidAppointmentPayment(onClose)
  return (
    <Dialog open onClose={mutation.isPending ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Anular pago · Cita #{appointment.id}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity="warning">La cita volverá a estar pendiente y el resumen se recalculará. El pago original y el motivo quedarán en el historial.</Alert>
          <Controller name="reason" control={control} render={({ field, fieldState }) => (
            <TextField {...field} label="Motivo de la anulación" multiline minRows={3} error={!!fieldState.error} helperText={fieldState.error?.message} />
          )} />
        </Stack>
      </DialogContent>
      <DialogActions><Button disabled={mutation.isPending} onClick={onClose}>Cancelar</Button>
        <AppButton color="error" variant="contained" loading={mutation.isPending} onClick={handleSubmit(({ reason }) => mutation.mutate({ id: appointment.id, reason }))}>Anular pago</AppButton>
      </DialogActions>
    </Dialog>
  )
}
