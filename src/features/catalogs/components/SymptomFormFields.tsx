import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

interface SymptomFormFieldsProps {
  control: Control<SymptomFormValues>
}

export function SymptomFormFields({ control }: SymptomFormFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Nombre del síntoma"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 150 } }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
