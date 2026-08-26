import { Controller, type Control } from 'react-hook-form'
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AHA_LIFESTYLE_COMPONENTS } from '../schemas/section-form.schema'
import type { SectionFormValues } from '../schemas/section-form.schema'

interface SectionFormFieldsProps {
  control: Control<SectionFormValues>
}

export function SectionFormFields({ control }: SectionFormFieldsProps) {
  return (
    <Stack spacing={2.5}>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField {...field} label="Título de la sección" error={!!error} helperText={error?.message} fullWidth />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Descripción"
            error={!!error}
            helperText={error?.message}
            multiline
            minRows={2}
            fullWidth
          />
        )}
      />

      <Controller
        name="lifestyleComponent"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="section-lifestyle-component-label">Componente de estilo de vida (AHA)</InputLabel>
            <Select {...field} labelId="section-lifestyle-component-label" label="Componente de estilo de vida (AHA)">
              {AHA_LIFESTYLE_COMPONENTS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Stack>
  )
}
