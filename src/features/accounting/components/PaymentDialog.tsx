import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { PricingFields } from '@/components/ui/PricingFields'
import { usePaymentMethods } from '@/features/catalogs'
import { usePayAppointment, useUpdateAppointmentPricing } from '../hooks/useAccounting'
import { paymentSchema } from '../schemas/accounting.schema'
import type { AccountingAppointment, PaymentPayload } from '../types'

type Props = { appointment: AccountingAppointment; mode: 'pay' | 'price'; onClose: () => void }

export function PaymentDialog({ appointment, mode, onClose }: Props) {
  const paying = mode === 'pay'
  const methods = usePaymentMethods('accounting', paying)
  const { control, handleSubmit } = useForm<PaymentPayload>({
    resolver: zodResolver(paymentSchema.extend({
      paymentMethodId: paying ? paymentSchema.shape.paymentMethodId : z.number(),
      paymentDate: paying ? paymentSchema.shape.paymentDate : z.string(),
    })),
    defaultValues: { basePrice: appointment.basePrice ?? undefined, discountPercent: appointment.discountPercent, paymentMethodId: 0, paymentDate: '' },
  })
  const pay = usePayAppointment(onClose)
  const price = useUpdateAppointmentPricing(onClose)
  const pending = pay.isPending || price.isPending
  const available = methods.data?.filter((method) => method.active) ?? []
  return (
    <Dialog open onClose={pending ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{paying ? 'Registrar pago' : 'Ajustar precio'} · Cita #{appointment.id}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography>{appointment.patientName} · {appointment.specialistName ?? 'Sin especialista'}</Typography>
          <Typography color="text.secondary">Importes en USD</Typography>
          <PricingFields control={control} disabled={pending} />
          {paying && <>
            <Controller name="paymentDate" control={control} render={({ field, fieldState }) => (
              <TextField {...field} type="date" label="Fecha de pago" required fullWidth disabled={pending}
                error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Indica el día en que se realizó el pago.'}
                slotProps={{ inputLabel: { shrink: true } }} />
            )} />
            {methods.isError && <Alert severity="error">No se pudieron cargar los métodos. <Button onClick={() => void methods.refetch()}>Reintentar</Button></Alert>}
            {!methods.isLoading && !methods.isError && available.length === 0 && <Alert severity="warning">Crea o activa un método de pago en Catálogos para continuar.</Alert>}
            <Controller name="paymentMethodId" control={control} render={({ field, fieldState }) => (
              <TextField {...field} select label="Método de pago" value={field.value || ''} onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={methods.isLoading || pending} error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth>
                {available.map((method) => <MenuItem key={method.id} value={method.id} sx={{ borderLeft: '5px solid', borderLeftColor: method.color }}>{method.name}</MenuItem>)}
              </TextField>
            )} />
          </>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={pending}>Cancelar</Button>
        <AppButton variant="contained" loading={pending} disabled={paying && (methods.isError || available.length === 0)}
          onClick={handleSubmit((payload) => paying ? pay.mutate({ id: appointment.id, payload }) : price.mutate({ id: appointment.id, payload: { basePrice: payload.basePrice, discountPercent: payload.discountPercent } }))}>
          {paying ? 'Confirmar pago' : 'Guardar precio'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
