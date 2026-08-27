import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useBodySystems } from '../hooks/useBodySystems'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

interface SymptomFormFieldsProps {
  control: Control<SymptomFormValues>
}

export function SymptomFormFields({ control }: SymptomFormFieldsProps) {
  const { data: bodySystems = [] } = useBodySystems()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="cie10Code"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Código CIE-10"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 10 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="bodySystemId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="symptom-body-system-label">Aparato / sistema</InputLabel>
              <Select<number | ''>
                labelId="symptom-body-system-label"
                label="Aparato / sistema"
                value={field.value ?? ''}
                onChange={(event) =>
                  field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
                }
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {bodySystems.map((system) => (
                  <MenuItem key={system.id} value={system.id}>
                    {system.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  )
}
