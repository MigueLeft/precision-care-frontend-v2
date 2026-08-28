import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useMedicationPresentations } from '../hooks/useMedicationPresentations'
import { useMedicationCategories } from '../hooks/useMedicationCategories'
import type { MedicationFormValues } from '../schemas/medication-form.schema'

interface MedicationFormFieldsProps {
  control: Control<MedicationFormValues>
}

export function MedicationFormFields({ control }: MedicationFormFieldsProps) {
  const { data: presentations = [] } = useMedicationPresentations()
  const { data: categories = [] } = useMedicationCategories()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="brandName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Nombre comercial"
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
          name="genericName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Sustancia activa"
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
          name="presentationId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="medication-presentation-label">Presentación</InputLabel>
              <Select
                labelId="medication-presentation-label"
                label="Presentación"
                value={field.value || ''}
                onChange={(event) => field.onChange(Number(event.target.value))}
              >
                {presentations.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="concentration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Concentración"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 50 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="medication-category-label">Categoría</InputLabel>
              <Select<number | ''>
                labelId="medication-category-label"
                label="Categoría"
                value={field.value ?? ''}
                onChange={(event) =>
                  field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
                }
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
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
