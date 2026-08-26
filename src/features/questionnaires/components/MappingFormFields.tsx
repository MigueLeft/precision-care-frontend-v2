import { Controller, useWatch, type Control } from 'react-hook-form'
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import type { MappingFormValues } from '../schemas/mapping-form.schema'

const SCORING_OPTIONS = [
  { value: 'sum', label: 'Suma simple' },
  { value: 'weighted_sum', label: 'Suma ponderada' },
  { value: 'range_lookup', label: 'Interpretación por rango' },
  { value: 'custom_function', label: 'Función personalizada' },
] as const

const DESTINATION_OPTIONS = [
  { value: 'antecedent', label: 'Antecedente' },
  { value: 'allergy', label: 'Alergia' },
  { value: 'lifestyle', label: 'Estilo de vida' },
  { value: 'patient_field', label: 'Campo del paciente' },
  { value: 'body_composition', label: 'Composición corporal' },
  { value: 'custom', label: 'Personalizado (handler)' },
] as const

interface MappingFormFieldsProps {
  control: Control<MappingFormValues>
}

export function MappingFormFields({ control }: MappingFormFieldsProps) {
  const destinationType = useWatch({ control, name: 'destinationType' })

  return (
    <Stack spacing={2.5}>
      <Controller
        name="scoringType"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel id="mapping-scoring-type-label">Tipo de puntuación</InputLabel>
            <Select {...field} labelId="mapping-scoring-type-label" label="Tipo de puntuación">
              {SCORING_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="destinationType"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel id="mapping-destination-type-label">Destino</InputLabel>
            <Select {...field} labelId="mapping-destination-type-label" label="Destino">
              {DESTINATION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {destinationType === 'antecedent' && (
        <Alert severity="info">
          Cada opción seleccionada por el paciente crea un antecedente. Usa el campo "valor" de la opción
          para el código CIE-10 y "parámetros" para indicar el tipo de antecedente, ej.{' '}
          <code>{`{"antecedentType": "personal"}`}</code>.
        </Alert>
      )}

      {destinationType === 'patient_field' && (
        <Controller
          name="destinationField"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Campo del paciente"
              placeholder="ej. maritalStatus"
              error={!!error}
              helperText={error?.message}
              fullWidth
            />
          )}
        />
      )}

      {destinationType === 'custom' && (
        <Controller
          name="handlerName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Nombre del handler"
              error={!!error}
              helperText={error?.message}
              fullWidth
            />
          )}
        />
      )}

      <Controller
        name="destinationTable"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Tabla destino (opcional)"
            error={!!error}
            helperText={error?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="parametersJson"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Parámetros (JSON, opcional)"
            error={!!error}
            helperText={error?.message}
            multiline
            minRows={2}
            fullWidth
          />
        )}
      />
    </Stack>
  )
}
