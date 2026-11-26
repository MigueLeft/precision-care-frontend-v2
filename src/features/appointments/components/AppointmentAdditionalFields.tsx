import { Controller, type Control } from 'react-hook-form'
import { Checkbox, FormControlLabel, Grid, Stack, TextField, Typography } from '@mui/material'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'

type Props = { control: Control<AppointmentFormValues> }
export function AppointmentAdditionalFields({ control }: Props) {
  return <>
    <Grid size={{ xs: 12 }}><Controller name="reason" control={control} render={({ field }) => (
      <TextField {...field} value={field.value ?? ''} label="Motivo de consulta" multiline minRows={2} fullWidth />
    )} /></Grid>
    <Grid size={{ xs: 12 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>Recordatorios</Typography>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Controller name="remindEmail" control={control} render={({ field }) => (
          <FormControlLabel control={<Checkbox checked={field.value} onChange={field.onChange} />} label="Email" />
        )} />
        <FormControlLabel control={<Checkbox checked disabled />} label="WhatsApp" />
      </Stack>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Los recordatorios automáticos y WhatsApp aún no están integrados. El envío por email es manual desde el detalle de la cita.</Typography>
    </Grid>
  </>
}
