import { Controller, type Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import type { SpecialistFormValues } from '../schemas/specialist-form.schema'

// Membrete del récipe: títulos y registros profesionales. La dirección y el
// teléfono del pie salen de los datos del especialista.
export function SpecialistLetterheadFields({ control }: { control: Control<SpecialistFormValues> }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 7 }}>
        <Controller
          name="professionalTitles"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Títulos (uno por línea)"
              placeholder={'Médico Especialista en Medicina Interna\nMagister en Nutrición'}
              multiline
              minRows={2}
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <Controller
          name="registrationNumbers"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Registros profesionales"
              placeholder="CI: 9.552.274  MSDS: 37.808  CML: 3.087"
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
