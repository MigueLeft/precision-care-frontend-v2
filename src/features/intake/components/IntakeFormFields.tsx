import { Controller, type Control } from 'react-hook-form'
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { IntakeFormValues } from '../schemas/intake-form.schema'

const TYPE_OPTIONS = [
  { value: 'lifestyle', label: 'Estilo de vida' },
  { value: 'psychometric', label: 'Psicométrico' },
  { value: 'antecedents', label: 'Antecedentes' },
  { value: 'other', label: 'Otro' },
] as const

interface IntakeFormFieldsProps {
  control: Control<IntakeFormValues>
}

export function IntakeFormFields({ control }: IntakeFormFieldsProps) {
  return (
    <Stack spacing={2.5}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Nombre del ingresable"
            error={!!error}
            helperText={error?.message}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 150 } }}
          />
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
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel id="intake-type-label">Tipo</InputLabel>
            <Select {...field} labelId="intake-type-label" label="Tipo">
              {TYPE_OPTIONS.map((option) => (
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
