import { Controller, type Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import { PhoneField } from '@/components/PhoneField'
import type { PatientFormValues } from '../schemas/patient-form.schema'

type PatientContactFieldsProps = {
  control: Control<PatientFormValues>
}

// Datos de contacto del paciente: correo y teléfono (con selector de país).
export function PatientContactFields({ control }: PatientContactFieldsProps) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="email"
              label="Correo electrónico"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <PhoneField
              label="Teléfono"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </>
  )
}
