import { useFieldArray, Controller, type Control } from 'react-hook-form'
import { Stack, TextField, IconButton, Typography, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { AppButton } from '@/components/AppButton'
import type { QuestionFormValues } from '../schemas/question-form.schema'

interface OptionsEditorProps {
  control: Control<QuestionFormValues>
}

export function OptionsEditor({ control }: OptionsEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'options' })

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Opciones
      </Typography>

      <Stack spacing={1.5}>
        {fields.map((field, index) => (
          <Stack key={field.id} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
            <Controller
              name={`options.${index}.text`}
              control={control}
              render={({ field: textField, fieldState: { error } }) => (
                <TextField
                  {...textField}
                  label="Texto"
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                  sx={{ flex: 2 }}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />
              )}
            />
            <Controller
              name={`options.${index}.value`}
              control={control}
              render={({ field: valueField, fieldState: { error } }) => (
                <TextField
                  {...valueField}
                  label="Valor"
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                  sx={{ flex: 1 }}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
              )}
            />
            <Controller
              name={`options.${index}.score`}
              control={control}
              render={({ field: scoreField, fieldState: { error } }) => (
                <TextField
                  {...scoreField}
                  label="Puntaje"
                  type="number"
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                  onChange={(event) => scoreField.onChange(Number(event.target.value))}
                  sx={{ width: 100 }}
                />
              )}
            />
            <IconButton size="small" onClick={() => remove(index)} aria-label="Eliminar opción" sx={{ mt: 0.5 }}>
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <AppButton
        size="small"
        startIcon={<AddIcon sx={{ fontSize: 16 }} />}
        onClick={() => append({ text: '', value: '', score: 0 })}
        sx={{ mt: 1.5 }}
      >
        Agregar opción
      </AppButton>
    </Box>
  )
}
