import { Controller, type Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import type { MedicationFormValues } from '../schemas/medication-form.schema'
import { MedicationFrequencyField } from './MedicationFrequencyField'

type Props = { control: Control<MedicationFormValues> }

const TEXT_FIELDS = [
  { name: 'dose', label: 'Dosis', placeholder: 'Ej. 1 tableta de 500 mg' },
  { name: 'duration', label: 'Duración', placeholder: 'Ej. 7 días o uso continuo' },
  { name: 'quantity', label: 'Cantidad' },
] as const

export function MedicationScheduleFields({ control }: Props) {
  return (
    <>
      {TEXT_FIELDS.map(({ name, label, ...props }) => (
        <Grid key={name} size={{ xs: 12, sm: 6 }}>
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} {...props} value={field.value ?? ''} label={label} fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        </Grid>
      ))}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller name="frequency" control={control} render={({ field }) => (
          <MedicationFrequencyField value={field.value ?? ''} onChange={field.onChange} />
        )} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller name="frequencyNotes" control={control} render={({ field, fieldState: { error } }) => (
          <TextField {...field} value={field.value ?? ''} label="Nota de frecuencia (opcional)" placeholder="Ej. después de comer o antes de dormir" multiline minRows={2} fullWidth error={!!error} helperText={error?.message} slotProps={{ htmlInput: { maxLength: 500 } }} />
        )} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller name="startAt" control={control} render={({ field, fieldState: { error } }) => (
          <TextField {...field} value={field.value ?? ''} type="date" label="Desde" fullWidth error={!!error} helperText={error?.message} slotProps={{ inputLabel: { shrink: true } }} />
        )} />
      </Grid>
    </>
  )
}
