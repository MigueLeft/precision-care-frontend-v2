import { Controller, useWatch, type Control } from 'react-hook-form'
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { OptionsEditor } from './OptionsEditor'
import { questionTypeHasOptions } from '../schemas/question-form.schema'
import type { QuestionFormValues } from '../schemas/question-form.schema'

const TYPE_OPTIONS = [
  { value: 'single_choice', label: 'Opción única' },
  { value: 'multiple_choice', label: 'Opción múltiple' },
  { value: 'scale', label: 'Escala' },
  { value: 'free_text', label: 'Texto libre' },
  { value: 'numeric', label: 'Numérico' },
  { value: 'date', label: 'Fecha' },
  { value: 'boolean', label: 'Sí/No' },
] as const

interface QuestionFormFieldsProps {
  control: Control<QuestionFormValues>
}

export function QuestionFormFields({ control }: QuestionFormFieldsProps) {
  const type = useWatch({ control, name: 'type' })

  return (
    <Stack spacing={2.5}>
      <Controller
        name="text"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Texto de la pregunta"
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
            <InputLabel id="question-type-label">Tipo de pregunta</InputLabel>
            <Select {...field} labelId="question-type-label" label="Tipo de pregunta">
              {TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="required"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
            label="Obligatoria"
          />
        )}
      />

      {questionTypeHasOptions(type) && <OptionsEditor control={control} />}
    </Stack>
  )
}
