import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

type ParaclinicalLoincFieldsProps = {
  control: Control<ParaclinicalFormValues>
}

// Código LOINC estándar del estudio y su descripción en español.
export function ParaclinicalLoincFields({ control }: ParaclinicalLoincFieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="loincCode"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Código LOINC"
              placeholder="2093-3"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 9 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              label="Descripción del examen"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 300 } }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
