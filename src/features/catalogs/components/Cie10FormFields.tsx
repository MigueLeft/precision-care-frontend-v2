import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useBodySystems } from '../hooks/useBodySystems'
import type { Cie10FormValues } from '../schemas/cie10-form.schema'

interface Cie10FormFieldsProps {
  control: Control<Cie10FormValues>
}

export function Cie10FormFields({ control }: Cie10FormFieldsProps) {
  const { data: bodySystems = [] } = useBodySystems()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              onChange={(event) => field.onChange(event.target.value.toUpperCase())}
              label="Código"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 10 } }}
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
              label="Descripción"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="chapter"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Capítulo"
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
          name="bodySystemId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="cie10-body-system-label">Aparato / sistema</InputLabel>
              <Select<number | ''>
                labelId="cie10-body-system-label"
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
