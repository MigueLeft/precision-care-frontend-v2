import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import type { BodySystemFormValues } from '../schemas/body-system-form.schema'

interface BodySystemFormFieldsProps {
  control: Control<BodySystemFormValues>
}

export function BodySystemFormFields({ control }: BodySystemFormFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Nombre"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="shortCode"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              onChange={(event) => field.onChange(event.target.value.toUpperCase())}
              label="Código corto"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 20 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="cie10Chapter"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Capítulo CIE-10"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 20 } }}
            />
          )}
        />
      </Grid>
      <Grid size={12}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Descripción"
              fullWidth
              multiline
              minRows={2}
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
