import { Controller, type Control } from 'react-hook-form'
import { TextField } from '@mui/material'
import type { PatientFormValues } from '../schemas/patient-form.schema'

// Cédula u otro documento de identidad: se imprime en el récipe y la orden.
export function PatientIdentityField({ control }: { control: Control<PatientFormValues> }) {
  return (
    <Controller
      name="identityDocument"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label="Cédula / documento de identidad"
          placeholder="V-12.345.678"
          error={!!error}
          helperText={error?.message}
          slotProps={{ htmlInput: { maxLength: 30 } }}
        />
      )}
    />
  )
}
