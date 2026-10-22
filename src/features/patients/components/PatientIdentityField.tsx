import { Controller, type Control } from 'react-hook-form'
import { TextField } from '@mui/material'
import type { PatientFormValues } from '../schemas/patient-form.schema'

// Cédula u otro documento de identidad: se imprime en el récipe y la orden.
// Solo admite dígitos; cualquier otro carácter se descarta al escribir o pegar.
export function PatientIdentityField({ control }: { control: Control<PatientFormValues> }) {
  return (
    <Controller
      name="identityDocument"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
          label="Cédula / documento de identidad"
          placeholder="12345678"
          error={!!error}
          helperText={error?.message}
          slotProps={{ htmlInput: { maxLength: 30, inputMode: 'numeric' } }}
        />
      )}
    />
  )
}
