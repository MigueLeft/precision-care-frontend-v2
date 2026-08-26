import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import type { MedicationFormValues } from '../schemas/medication-form.schema'

interface MedicationFormFieldsProps {
  control: Control<MedicationFormValues>
}

export function MedicationFormFields({ control }: MedicationFormFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="brandName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Nombre comercial" fullWidth error={!!error} helperText={error?.message} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="genericName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Sustancia activa" fullWidth error={!!error} helperText={error?.message} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="presentation"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Presentación" fullWidth error={!!error} helperText={error?.message} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="concentration"
          control={control}
          render={({ field }) => <TextField {...field} label="Concentración" fullWidth />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => <TextField {...field} label="Categoría" fullWidth />}
        />
      </Grid>
    </Grid>
  )
}
