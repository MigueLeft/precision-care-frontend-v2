import { useEffect } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { paraclinicalValueTypeOptions } from '../schemas/paraclinical-form.schema'
import { useParaclinicalCategories } from '../hooks/useParaclinicalCategories'
import { flattenCategoryOptions } from '../utils/paraclinical-category-tree'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

const VALUE_TYPE_LABELS: Record<
  (typeof paraclinicalValueTypeOptions)[number],
  string
> = {
  numeric: 'Numérico',
  text: 'Texto',
  boolean: 'Booleano',
}

interface ParaclinicalFormFieldsProps {
  control: Control<ParaclinicalFormValues>
  setValue: UseFormSetValue<ParaclinicalFormValues>
}

export function ParaclinicalFormFields({ control, setValue }: ParaclinicalFormFieldsProps) {
  const { data: categories = [] } = useParaclinicalCategories()
  const categoryOptions = flattenCategoryOptions(categories)
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
              label="Nombre del paraclínico"
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
          name="categoryId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="paraclinical-category-label">Categoría</InputLabel>
              <Select
                labelId="paraclinical-category-label"
                label="Categoría"
                value={field.value || ''}
                onChange={(event) => field.onChange(Number(event.target.value))}
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.depth > 0 ? `${'  '.repeat(option.depth)}— ` : ''}
                    {option.name}
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
              <InputLabel id="paraclinical-value-type-label">Tipo de valor</InputLabel>
              <Select labelId="paraclinical-value-type-label" label="Tipo de valor" {...field}>
                {paraclinicalValueTypeOptions.map((option) => (
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
