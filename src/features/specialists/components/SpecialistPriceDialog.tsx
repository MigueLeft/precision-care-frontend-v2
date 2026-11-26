import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useUpdateSpecialist } from '../hooks/useSpecialistMutations'
import type { Specialist } from '../types'

const schema = z.object({ defaultAppointmentPrice: z.number().finite().min(0).max(99999999.99).multipleOf(0.01).nullable() })
type Props = { specialist: Specialist; onClose: () => void }
export function SpecialistPriceDialog({ specialist, onClose }: Props) {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: { defaultAppointmentPrice: specialist.defaultAppointmentPrice ?? null } })
  const mutation = useUpdateSpecialist(specialist.id, { onSuccess: onClose })
  return (
    <Dialog open onClose={mutation.isPending ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Precio estándar por cita</DialogTitle>
      <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
        <Typography>{specialist.name} {specialist.lastName}</Typography>
        <Controller name="defaultAppointmentPrice" control={control} render={({ field, fieldState }) => (
          <TextField {...field} label="Precio estándar (USD)" type="number" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
            error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Se sugiere al seleccionar al especialista en nuevas citas. Deja vacío si aún no hay tarifa.'}
            slotProps={{ htmlInput: { min: 0, max: 99999999.99, step: 0.01 } }} fullWidth />
        )} />
        <Typography variant="body2" color="text.secondary">Este cambio se aplicará a nuevas citas. Las citas anteriores conservarán su precio.</Typography>
      </Stack></DialogContent>
      <DialogActions><Button onClick={onClose} disabled={mutation.isPending}>Cancelar</Button><AppButton variant="contained" loading={mutation.isPending} onClick={handleSubmit((payload) => mutation.mutate(payload))}>Guardar</AppButton></DialogActions>
    </Dialog>
  )
}
