import { Controller, type Control } from 'react-hook-form'
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { QuestionnaireFormValues } from '../schemas/questionnaire-form.schema'

const TYPE_OPTIONS = [
  { value: 'lifestyle', label: 'Estilo de vida' },
  { value: 'psychometric', label: 'Psicométrico' },
  { value: 'antecedents', label: 'Antecedentes' },
  { value: 'other', label: 'Otro' },
] as const

interface QuestionnaireFormFieldsProps {
  control: Control<QuestionnaireFormValues>
}

export function QuestionnaireFormFields({ control }: QuestionnaireFormFieldsProps) {
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
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel id="questionnaire-type-label">Tipo</InputLabel>
            <Select {...field} labelId="questionnaire-type-label" label="Tipo">
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
