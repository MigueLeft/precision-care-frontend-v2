import { useEffect } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { examCategoryOptions, examValueTypeOptions } from '../schemas/exam-form.schema'
import type { ExamFormValues } from '../schemas/exam-form.schema'

const CATEGORY_LABELS: Record<(typeof examCategoryOptions)[number], string> = {
  laboratory: 'Laboratorio',
  imaging: 'Imagenología',
  cardiology: 'Cardiología',
  other: 'Otro',
}

const VALUE_TYPE_LABELS: Record<(typeof examValueTypeOptions)[number], string> = {
  numeric: 'Numérico',
  text: 'Texto',
  boolean: 'Booleano',
}

interface ExamFormFieldsProps {
  control: Control<ExamFormValues>
  setValue: UseFormSetValue<ExamFormValues>
}

export function ExamFormFields({ control, setValue }: ExamFormFieldsProps) {
  const valueType = useWatch({ control, name: 'valueType' })
  const isNumericType = valueType === 'numeric'

  useEffect(() => {
    if (!isNumericType) {
      setValue('referenceMin', '')
      setValue('referenceMax', '')
    }
  }, [isNumericType, setValue])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Nombre del examen"
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
          name="category"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="exam-category-label">Categoría</InputLabel>
              <Select labelId="exam-category-label" label="Categoría" {...field}>
                {examCategoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {CATEGORY_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="defaultUnit"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Unidad por defecto"
              fullWidth
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 30 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="valueType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="exam-value-type-label">Tipo de valor</InputLabel>
              <Select labelId="exam-value-type-label" label="Tipo de valor" {...field}>
                {examValueTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {VALUE_TYPE_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="referenceMin"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Referencia mínima"
              fullWidth
              disabled={!isNumericType}
              error={!!error}
              helperText={error?.message ?? (isNumericType ? ' ' : 'Solo aplica para tipo numérico.')}
              slotProps={{ htmlInput: { maxLength: 30 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="referenceMax"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Referencia máxima"
              fullWidth
              disabled={!isNumericType}
              error={!!error}
              helperText={error?.message ?? (isNumericType ? ' ' : 'Solo aplica para tipo numérico.')}
              slotProps={{ htmlInput: { maxLength: 30 } }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
