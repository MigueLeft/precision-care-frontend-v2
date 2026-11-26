import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, useTheme } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useSavePaymentMethod } from '../hooks/usePaymentMethods'
import type { PaymentMethod } from '../types/payment-method'

const schema = z.object({ name: z.string().trim().min(1, 'Ingresa un nombre.').max(80), color: z.string().regex(/^#[0-9a-fA-F]{6}$/), active: z.boolean() })
type Props = { method: PaymentMethod | null; onClose: () => void }

export function PaymentMethodForm({ method, onClose }: Props) {
  const theme = useTheme()
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema),
    defaultValues: method ?? { name: '', color: theme.palette.primary.main, active: true } })
  const mutation = useSavePaymentMethod(onClose)
  return (
    <Dialog open onClose={mutation.isPending ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{method ? 'Editar método de pago' : 'Nuevo método de pago'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <Controller name="name" control={control} render={({ field, fieldState }) => (
            <TextField {...field} label="Nombre" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
          )} />
          <Controller name="color" control={control} render={({ field }) => <TextField {...field} label="Color" type="color" fullWidth />} />
          <Controller name="active" control={control} render={({ field }) => (
            <FormControlLabel label="Disponible para nuevos pagos" control={<Switch checked={field.value} onChange={field.onChange} />} />
          )} />
        </Stack>
      </DialogContent>
      <DialogActions><Button disabled={mutation.isPending} onClick={onClose}>Cancelar</Button>
        <AppButton variant="contained" loading={mutation.isPending} onClick={handleSubmit((payload) => mutation.mutate({ id: method?.id, payload }))}>Guardar</AppButton>
      </DialogActions>
    </Dialog>
  )
}
